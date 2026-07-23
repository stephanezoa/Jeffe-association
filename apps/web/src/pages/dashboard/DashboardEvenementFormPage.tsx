import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardPageHeader } from '../../components/dashboard/DashboardPageHeader';
import { TextField, TextAreaField, Field, FIELD_CLASS } from '../../components/ui/FormField';
import { Select } from '../../components/ui/Select';
import { Toggle } from '../../components/ui/Toggle';
import { FileDropzone } from '../../components/ui/FileDropzone';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { eventsApi, resolveCover } from '../../lib/api';
import { EVENT_FORM } from '../../data/admin-forms';

interface Errors {
  title?: string;
  category?: string;
  location?: string;
  date?: string;
  price?: string;
  places?: string;
}

export default function DashboardEvenementFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(Boolean(id));
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'free' | 'paid'>('free');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [limitPlaces, setLimitPlaces] = useState(false);
  const [places, setPlaces] = useState('');
  const [cover, setCover] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    eventsApi
      .listMine()
      .then((mine) => {
        const event = mine.find((e) => e.id === id || e.slug === id);
        if (cancelled || !event) return;
        setTitle(event.title);
        setCategory(event.category);
        setType(event.eventType);
        setPrice(event.priceCents ? String(event.priceCents) : '');
        setLocation(event.location);
        setDate(event.date?.slice(0, 10) ?? '');
        setLimitPlaces(event.capacity > 0);
        setPlaces(event.capacity ? String(event.capacity) : '');
        setCover(event.coverImageUrl);
        setDescription(event.description);
        setContent(event.content);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const submit = async () => {
    const next: Errors = {};
    const messages = EVENT_FORM.errors;
    if (title.trim().length < 3) next.title = messages.title;
    if (!category) next.category = messages.category;
    if (location.trim().length < 2) next.location = messages.location;
    if (!date) next.date = messages.date;
    if (type === 'paid' && !/^\d+$/.test(price.trim())) next.price = messages.price;
    if (limitPlaces && !/^\d+$/.test(places.trim())) next.places = messages.places;
    setErrors(next);

    if (Object.keys(next).length > 0) {
      setNotice('');
      return;
    }

    setSaving(true);
    setNotice('');
    try {
      const coverImageUrl = await resolveCover(cover);
      const payload = {
        title: title.trim(),
        category,
        eventType: type,
        priceCents: type === 'paid' ? Number(price) : 0,
        location: location.trim(),
        date,
        capacity: limitPlaces ? Number(places) : 0,
        coverImageUrl,
        description: description.trim(),
        content,
      };
      if (id) await eventsApi.update(id, payload);
      else await eventsApi.create(payload);
      navigate('/dashboard/evenements');
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
        title={id ? EVENT_FORM.editTitle : EVENT_FORM.createTitle}
        subtitle={EVENT_FORM.subtitle}
        action={{ label: EVENT_FORM.headerAction, to: '/dashboard/evenements/creer' }}
      />

      <form onSubmit={(event) => event.preventDefault()} noValidate className="max-w-3xl space-y-5">
        <TextField
          id="event-nom"
          label={EVENT_FORM.fields.title.label}
          placeholder={EVENT_FORM.fields.title.placeholder}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setErrors((current) => ({ ...current, title: undefined }));
          }}
          error={errors.title}
        />

        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Field id="event-categorie" label={EVENT_FORM.fields.category.label} error={errors.category}>
            <Select
              id="event-categorie"
              options={EVENT_FORM.categoryOptions}
              placeholder={EVENT_FORM.fields.category.placeholder}
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setErrors((current) => ({ ...current, category: undefined }));
              }}
            />
          </Field>

          <Field id="event-type" label={EVENT_FORM.fields.type.label}>
            <Select
              id="event-type"
              options={EVENT_FORM.typeOptions}
              value={type}
              onChange={(event) => setType(event.target.value as 'free' | 'paid')}
            />
          </Field>

          <TextField
            id="event-lieu"
            label={EVENT_FORM.fields.location.label}
            placeholder={EVENT_FORM.fields.location.placeholder}
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              setErrors((current) => ({ ...current, location: undefined }));
            }}
            error={errors.location}
          />

          <TextField
            id="event-date"
            type="date"
            label={EVENT_FORM.fields.date.label}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setErrors((current) => ({ ...current, date: undefined }));
            }}
            error={errors.date}
          />
        </div>

        {type === 'paid' && (
          <Field id="event-prix" label={EVENT_FORM.fields.price.label} error={errors.price} className="max-w-xs">
            <div className="flex items-stretch overflow-hidden rounded-md ring-1 ring-inset ring-black/[0.06] focus-within:ring-2 focus-within:ring-accent-blue/50">
              <input
                id="event-prix"
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(event) => {
                  setPrice(event.target.value);
                  setErrors((current) => ({ ...current, price: undefined }));
                }}
                placeholder="0"
                className="w-full bg-[#F5F8FD] px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <span className="flex items-center bg-surface-muted px-3 text-sm text-ink-muted">{EVENT_FORM.currency}</span>
            </div>
          </Field>
        )}

        <div className="space-y-3">
          <Toggle
            id="event-limite"
            checked={limitPlaces}
            onChange={setLimitPlaces}
            label={EVENT_FORM.fields.limitPlaces.label}
          />
          {limitPlaces && (
            <div className="max-w-xs">
              <input
                id="event-places"
                type="text"
                inputMode="numeric"
                value={places}
                onChange={(event) => {
                  setPlaces(event.target.value);
                  setErrors((current) => ({ ...current, places: undefined }));
                }}
                placeholder="0"
                aria-label={EVENT_FORM.fields.places.label}
                className={FIELD_CLASS}
              />
              {errors.places && <p className="mt-1.5 text-xs text-red-600">{errors.places}</p>}
            </div>
          )}
        </div>

        <TextAreaField
          id="event-description"
          label={EVENT_FORM.fields.description.label}
          placeholder={EVENT_FORM.fields.description.placeholder}
          rows={2}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <FileDropzone label={EVENT_FORM.fields.cover.label} value={cover} onChange={setCover} />

        <RichTextEditor
          id="event-contenu"
          label={EVENT_FORM.fields.content.label}
          placeholder={EVENT_FORM.fields.content.placeholder}
          value={content}
          onChange={setContent}
        />

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="rounded-md bg-accent-blueDark px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#16306F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blueDark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Enregistrement…' : EVENT_FORM.submit}
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
