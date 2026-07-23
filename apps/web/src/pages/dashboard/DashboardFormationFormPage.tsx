import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardPageHeader } from '../../components/dashboard/DashboardPageHeader';
import { TextField, TextAreaField, Field } from '../../components/ui/FormField';
import { Select } from '../../components/ui/Select';
import { FileDropzone } from '../../components/ui/FileDropzone';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { TagInput } from '../../components/dashboard/TagInput';
import { coursesApi, resolveCover } from '../../lib/api';
import { FORMATION_FORM } from '../../data/admin-forms';

type Errors = { title?: string; duration?: string; content?: string };

export default function DashboardFormationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(Boolean(id));
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState('draft');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    coursesApi
      .listMine()
      .then((mine) => {
        const course = mine.find((c) => c.id === id || c.slug === id);
        if (cancelled || !course) return;
        setTitle(course.title);
        setDuration(course.duration);
        setDescription(course.description);
        setCover(course.thumbnailUrl);
        setTags(course.tags);
        setStatus(course.status);
        setContent(course.content);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const submit = async () => {
    const next: Errors = {};
    if (title.trim().length < 3) next.title = FORMATION_FORM.errors.title;
    if (duration.trim().length < 2) next.duration = FORMATION_FORM.errors.duration;
    if (content.replace(/<[^>]*>/g, '').trim().length === 0) next.content = FORMATION_FORM.errors.content;
    setErrors(next);

    if (Object.keys(next).length > 0) {
      setNotice('');
      return;
    }

    setSaving(true);
    setNotice('');
    try {
      const thumbnailUrl = await resolveCover(cover);
      const payload = {
        title: title.trim(),
        duration: duration.trim(),
        description: description.trim(),
        tags,
        thumbnailUrl,
        content,
        status: status as 'draft' | 'published' | 'done',
      };
      if (id) await coursesApi.update(id, payload);
      else await coursesApi.create(payload);
      navigate('/dashboard/formations');
    } catch (err: any) {
      setNotice(err.response?.data?.error?.message || 'L’enregistrement a échoué.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-ink-muted">Chargement…</p>;
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={id ? FORMATION_FORM.editTitle : FORMATION_FORM.createTitle}
        subtitle={FORMATION_FORM.subtitle}
        action={{ label: FORMATION_FORM.headerAction, to: '/dashboard/formations/creer' }}
      />

      <form onSubmit={(event) => event.preventDefault()} noValidate className="max-w-3xl space-y-5">
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <TextField
            id="formation-nom"
            label={FORMATION_FORM.fields.title.label}
            placeholder={FORMATION_FORM.fields.title.placeholder}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setErrors((current) => ({ ...current, title: undefined }));
            }}
            error={errors.title}
          />
          <TextField
            id="formation-duree"
            label={FORMATION_FORM.fields.duration.label}
            placeholder={FORMATION_FORM.fields.duration.placeholder}
            value={duration}
            onChange={(event) => {
              setDuration(event.target.value);
              setErrors((current) => ({ ...current, duration: undefined }));
            }}
            error={errors.duration}
          />
        </div>

        <TextAreaField
          id="formation-description"
          label={FORMATION_FORM.fields.description.label}
          placeholder={FORMATION_FORM.fields.description.placeholder}
          rows={2}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <FileDropzone label={FORMATION_FORM.fields.cover.label} value={cover} onChange={setCover} />

        <TagInput
          label={FORMATION_FORM.fields.tags.label}
          placeholder={FORMATION_FORM.fields.tags.placeholder}
          addLabel={FORMATION_FORM.fields.tags.add}
          tags={tags}
          onChange={setTags}
        />

        <Field id="formation-statut" label={FORMATION_FORM.fields.status.label} className="max-w-xs">
          <Select
            id="formation-statut"
            options={FORMATION_FORM.statusOptions}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          />
        </Field>

        <div>
          <RichTextEditor
            id="formation-contenu"
            label={FORMATION_FORM.fields.content.label}
            placeholder={FORMATION_FORM.fields.content.placeholder}
            value={content}
            onChange={(html) => {
              setContent(html);
              setErrors((current) => ({ ...current, content: undefined }));
            }}
          />
          {errors.content && <p className="mt-1.5 text-xs text-red-600">{errors.content}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="rounded-md bg-accent-blueDark px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#16306F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blueDark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Enregistrement…' : FORMATION_FORM.submit}
          </button>
          {notice && (
            <p role="status" className="text-sm text-red-600">
              {notice}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
