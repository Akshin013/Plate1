"use client";
import { useEffect, useState } from "react";
import EventLocationPickerLoader from "./EventLocationPickerLoader";

const emptyEvent = {
  title: "",
  type: "Автовстреча",
  city: "Москва",
  address: "",
  latitude: "",
  longitude: "",
  event_date: "",
  event_time: "",
  description: "",
  image: "",
  organizer: "",
  contact: "",
  status: "approved",
};

const statusLabels = {
  approved: "Опубликовано",
  pending: "На модерации",
  rejected: "Отклонено",
};

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyEvent);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadEvents() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/events", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Не удалось загрузить мероприятия");
      }

      setEvents(result.events || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyEvent);
    setEditingId(null);
    setMessage("");
  }

  function editEvent(event) {
    setForm({
      ...emptyEvent,
      ...event,
    });

    setEditingId(event.id);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function uploadImage(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Выберите файл изображения.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setMessage("Размер изображения не должен превышать 8 МБ.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const signatureResponse = await fetch("/api/admin/cloudinary-signature", {
        method: "POST",
      });

      const signatureData = await signatureResponse.json();

      if (!signatureResponse.ok || !signatureData.ok) {
        throw new Error(
          signatureData.error || "Не удалось получить подпись Cloudinary",
        );
      }

      const cloudName = signatureData.cloudName;
      const uploadData = new FormData();

      uploadData.append("file", file);
      uploadData.append("api_key", signatureData.apiKey);
      uploadData.append("timestamp", signatureData.timestamp);
      uploadData.append("signature", signatureData.signature);

      if (signatureData.folder) {
        uploadData.append("folder", signatureData.folder);
      }

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        },
      );

      const uploadedImage = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadedImage.error?.message || "Ошибка загрузки изображения",
        );
      }

      setForm((previous) => ({
        ...previous,
        image: uploadedImage.secure_url,
      }));

      setMessage("Изображение успешно загружено.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function saveEvent(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.city.trim() || !form.event_date) {
      setMessage("Заполните название, город и дату мероприятия.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: editingId ? "update" : "create",
          id: editingId,
          event: form,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Не удалось сохранить мероприятие");
      }

      setMessage(
        editingId ? "Мероприятие обновлено." : "Мероприятие добавлено.",
      );

      resetForm();
      await loadEvents();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(id) {
    if (!window.confirm("Удалить это мероприятие?")) return;

    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Не удалось удалить мероприятие");
      }

      setMessage("Мероприятие удалено.");
      await loadEvents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="admin-events">
      <div className="admin-events-heading">
        <div>
          <span className="events-overline">PLATE COMMUNITY</span>
          <h2>Мероприятия</h2>
          <p>Управление автомобильными событиями</p>
        </div>

        <span className="events-count">
          <strong>{events.length}</strong>
          <span>мероприятий</span>
        </span>
      </div>

      <form className="admin-event-form" onSubmit={saveEvent}>
        <h3>{editingId ? "Редактировать мероприятие" : "Новое мероприятие"}</h3>

        <div className="admin-event-fields">
          <label>
            Название *
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="Например, Moscow Car Meet"
              required
            />
          </label>

          <label>
            Тип мероприятия
            <input
              name="type"
              value={form.type}
              onChange={updateField}
              placeholder="Автовстреча, выставка, дрифт..."
            />
          </label>

          <label>
            Город *
            <input
              name="city"
              value={form.city}
              onChange={updateField}
              placeholder="Москва"
              required
            />
          </label>

          <label>
            Адрес
            <input
              name="address"
              value={form.address}
              onChange={updateField}
              placeholder="Улица, площадка..."
            />
          </label>

          <EventLocationPickerLoader
            latitude={form.latitude}
            longitude={form.longitude}
            onChange={({ latitude, longitude }) => {
              setForm((previous) => ({
                ...previous,
                latitude,
                longitude,
              }));
            }}
          />

          <label>
            Дата *
            <input
              type="date"
              name="event_date"
              value={form.event_date}
              onChange={updateField}
              required
            />
          </label>

          <label>
            Время
            <input
              type="time"
              name="event_time"
              value={form.event_time}
              onChange={updateField}
            />
          </label>

          <label>
            Организатор
            <input
              name="organizer"
              value={form.organizer}
              onChange={updateField}
              placeholder="Название клуба или имя"
            />
          </label>

          <label>
            Контакты
            <input
              name="contact"
              value={form.contact}
              onChange={updateField}
              placeholder="Telegram, телефон или ссылка"
            />
          </label>

          {editingId && (
            <label>
              Статус
              <select name="status" value={form.status} onChange={updateField}>
                <option value="approved">Опубликовано</option>
                <option value="pending">На модерации</option>
                <option value="rejected">Отклонено</option>
              </select>
            </label>
          )}
        </div>

        <label className="admin-event-description">
          Описание
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            rows={5}
            placeholder="Расскажи подробнее о мероприятии..."
          />
        </label>

        <div className="admin-event-upload">
          <span>Обложка мероприятия</span>

          {form.image && (
            <div className="admin-event-preview">
              <img src={form.image} alt="Обложка мероприятия" />

              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    image: "",
                  }))
                }
              >
                Удалить изображение
              </button>
            </div>
          )}

          <label className="admin-event-upload-button">
            {uploading ? "Загрузка..." : "Выбрать изображение"}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(event) => {
                uploadImage(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
        </div>

        <div className="admin-event-actions">
          <button type="submit" disabled={saving || uploading}>
            {saving
              ? "Сохранение..."
              : editingId
                ? "Сохранить изменения"
                : "Добавить мероприятие"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Отмена
            </button>
          )}
        </div>

        {message && <p className="admin-event-message">{message}</p>}
      </form>

      <div className="admin-event-list">
        <h3>Все мероприятия</h3>

        {loading ? (
          <p>Загрузка мероприятий...</p>
        ) : events.length === 0 ? (
          <p>Мероприятий пока нет.</p>
        ) : (
          events.map((event) => (
            <div className="admin-event-item" key={event.id}>
              <div className="admin-event-item-info">
                {event.image && <img src={event.image} alt="" />}

                <div>
                  <strong>{event.title}</strong>
                  <span>
                    {event.city} · {event.event_date}
                  </span>
                  <small>{statusLabels[event.status] || event.status}</small>
                </div>
              </div>

              <div className="admin-event-item-actions">
                <button type="button" onClick={() => editEvent(event)}>
                  Изменить
                </button>

                <button type="button" onClick={() => removeEvent(event.id)}>
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
