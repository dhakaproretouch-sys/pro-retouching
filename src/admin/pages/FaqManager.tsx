import React from 'react';
import { useForm } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';
import type { Faq } from '../../lib/types';
import { ResourceManager } from '../resource/ResourceManager';
import { useResourceManager } from '../resource/useResourceManager';
import { FormModal } from '../resource/FormModal';
import { TextAreaField } from '../resource/fields';

interface FaqFormValues {
  question: string;
  answer: string;
}

const FaqFormModal: React.FC<{
  open: boolean;
  item: Faq | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, item, onClose, onSaved }) => {
  const isEdit = Boolean(item);
  const methods = useForm<FaqFormValues>({
    defaultValues: { question: '', answer: '' },
  });

  const { register, formState, reset } = methods;

  React.useEffect(() => {
    if (!open) return;
    reset({
      question: item?.question || '',
      answer: item?.answer || '',
    });
  }, [open, item, reset]);

  return (
    <FormModal<FaqFormValues>
      open={open}
      item={item}
      resource="faqs"
      title={isEdit ? 'Edit FAQ' : 'Add FAQ'}
      description="Questions and answers shown on the public FAQ section."
      methods={methods}
      onClose={onClose}
      onSaved={onSaved}
      size="lg"
      toPayload={(values) => ({
        question: values.question.trim(),
        answer: values.answer.trim(),
      })}
      validate={(values) => {
        if (!values.question.trim()) return 'Question is required';
        if (!values.answer.trim()) return 'Answer is required';
        return null;
      }}
    >
      <TextAreaField
        label="Question"
        required
        rows={2}
        placeholder="e.g. What is your turnaround time?"
        error={formState.errors.question?.message}
        {...register('question', { required: 'Question is required' })}
      />

      <TextAreaField
        label="Answer"
        required
        rows={5}
        placeholder="Write a clear, helpful answer…"
        error={formState.errors.answer?.message}
        {...register('answer', { required: 'Answer is required' })}
      />
    </FormModal>
  );
};

export const FaqManager: React.FC = () => {
  const hook = useResourceManager<Faq>({
    resource: 'faqs',
    queryKey: 'faqs',
    canReorder: true,
    searchKeys: ['question', 'answer'],
  });

  return (
    <ResourceManager<Faq>
      hook={hook}
      title="FAQs"
      description="Frequently asked questions. Drag rows to reorder."
      singular="FAQ"
      icon={HelpCircle}
      emptyTitle="No FAQs yet"
      emptyDescription="Add frequently asked questions to help potential customers."
      canReorder
      searchPlaceholder="Search questions…"
      rowLabel={(item) => item.question}
      FormModal={FaqFormModal}
      columns={[
        {
          key: 'question',
          header: 'Question',
          render: (item) => (
            <p className="text-sm font-semibold text-slate-700 line-clamp-2">{item.question}</p>
          ),
          className: 'md:flex-[2]',
        },
        {
          key: 'answer',
          header: 'Answer',
          render: (item) => (
            <p className="text-xs text-slate-500 line-clamp-2">{item.answer}</p>
          ),
          className: 'hidden lg:block',
        },
      ]}
    />
  );
};

export default FaqManager;
