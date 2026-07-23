import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardPageHeader } from '../../components/dashboard/DashboardPageHeader';
import { TextField, TextAreaField } from '../../components/ui/FormField';
import { FileDropzone } from '../../components/ui/FileDropzone';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { cn } from '../../lib/cn';
import { articlesApi, resolveCover } from '../../lib/api';
import { ARTICLE_FORM } from '../../data/admin-forms';

type Errors = { title?: string; summary?: string; content?: string };

export default function DashboardArticleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(Boolean(id));
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [cover, setCover] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // En édition, on repart de la liste de l'auteur pour préremplir le formulaire.
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    articlesApi
      .listMine()
      .then((mine) => {
        const article = mine.find((a) => a.id === id || a.slug === id);
        if (cancelled || !article) return;
        setTitle(article.title);
        setSummary(article.summary);
        setCover(article.coverImageUrl);
        setContent(article.content);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const validate = (): boolean => {
    const next: Errors = {};
    if (title.trim().length < 3) next.title = ARTICLE_FORM.errors.title;
    if (summary.trim().length < 3) next.summary = ARTICLE_FORM.errors.summary;
    if (content.replace(/<[^>]*>/g, '').trim().length === 0) next.content = ARTICLE_FORM.errors.content;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (mode: 'publish' | 'draft') => async () => {
    if (!validate()) {
      setNotice(null);
      return;
    }

    setSaving(true);
    setNotice(null);
    try {
      const coverImageUrl = await resolveCover(cover);
      const payload = {
        title: title.trim(),
        summary: summary.trim(),
        content,
        coverImageUrl,
        status: mode === 'publish' ? ('published' as const) : ('draft' as const),
      };

      if (id) await articlesApi.update(id, payload);
      else await articlesApi.create(payload);

      navigate('/dashboard/articles');
    } catch (err: any) {
      setNotice({ tone: 'error', message: err.response?.data?.error?.message || ARTICLE_FORM.errors.title });
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
        title={id ? ARTICLE_FORM.editTitle : ARTICLE_FORM.createTitle}
        subtitle={ARTICLE_FORM.subtitle}
        action={{ label: ARTICLE_FORM.headerAction, to: '/dashboard/articles/creer' }}
      />

      <form onSubmit={(event) => event.preventDefault()} noValidate className="max-w-3xl space-y-5">
        <TextField
          id="article-titre"
          label={ARTICLE_FORM.fields.title.label}
          placeholder={ARTICLE_FORM.fields.title.placeholder}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setErrors((current) => ({ ...current, title: undefined }));
          }}
          error={errors.title}
        />

        <TextAreaField
          id="article-description"
          label={ARTICLE_FORM.fields.summary.label}
          placeholder={ARTICLE_FORM.fields.summary.placeholder}
          rows={2}
          value={summary}
          onChange={(event) => {
            setSummary(event.target.value);
            setErrors((current) => ({ ...current, summary: undefined }));
          }}
          error={errors.summary}
        />

        <FileDropzone label={ARTICLE_FORM.fields.cover.label} value={cover} onChange={setCover} />

        <div>
          <RichTextEditor
            id="article-contenu"
            label={ARTICLE_FORM.fields.content.label}
            placeholder={ARTICLE_FORM.fields.content.placeholder}
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
            onClick={submit('publish')}
            disabled={saving}
            className="rounded-md bg-accent-blueDark px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#16306F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blueDark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {ARTICLE_FORM.publish}
          </button>
          <button
            type="button"
            onClick={submit('draft')}
            disabled={saving}
            className="rounded-md bg-white px-5 py-2.5 text-sm text-ink ring-1 ring-inset ring-black/[0.12] transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue disabled:cursor-not-allowed disabled:opacity-60"
          >
            {ARTICLE_FORM.draft}
          </button>
        </div>

        {notice && (
          <p role="status" className={cn('text-sm', notice.tone === 'success' ? 'text-brand-600' : 'text-red-600')}>
            {notice.message}
          </p>
        )}
      </form>
    </div>
  );
}
