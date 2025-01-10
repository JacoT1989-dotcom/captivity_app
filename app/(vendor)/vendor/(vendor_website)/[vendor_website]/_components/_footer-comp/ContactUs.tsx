"use client";

import React, { useState, useCallback } from "react";
import { useSession } from "@/app/(vendor)/SessionProvider";
import { Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import {
  ContactInfo,
  useContactData,
  useContactStore,
} from "../../welcome/_store/contactUsStore";

type ContactFormData = Omit<ContactInfo, "id" | "userSettingsId">;

interface RenderContactProps {
  contact: ContactInfo;
  onEdit: (contact: ContactInfo) => void;
  onDelete: (id: string) => void;
  isVendor: boolean;
}

interface RenderFormProps {
  data: ContactFormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const RenderContact: React.FC<RenderContactProps> = React.memo(
  ({ contact, onEdit, onDelete, isVendor }) => (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white text-lg">{contact.city}</h3>
        {isVendor && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(contact)}
              className="p-1.5 rounded hover:bg-gray-700 transition-colors"
              title="Edit contact"
            >
              <Pencil size={16} className="text-white" />
            </button>
            <button
              onClick={() => onDelete(contact.id)}
              className="p-1.5 rounded hover:bg-gray-700 transition-colors"
              title="Delete contact"
            >
              <Trash2 size={16} className="text-white" />
            </button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-gray-300">
          General:{" "}
          <a
            href={`mailto:${contact.general}`}
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            {contact.general}
          </a>
        </p>
        <p className="text-gray-300">
          Website Queries:{" "}
          <a
            href={`mailto:${contact.websiteQueries}`}
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            {contact.websiteQueries}
          </a>
        </p>
        <p className="text-gray-300">Tel: {contact.telephone}</p>
      </div>
    </div>
  )
);

const RenderForm: React.FC<RenderFormProps> = React.memo(
  ({ data, onSubmit, onChange, onCancel }) => (
    <form
      onSubmit={onSubmit}
      className="space-y-4 bg-gray-800 p-4 rounded-lg mt-4"
    >
      <div>
        <label className="block text-sm font-medium text-white">City</label>
        <input
          type="text"
          name="city"
          value={data.city}
          onChange={onChange}
          className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">
          Telephone
        </label>
        <input
          type="text"
          name="telephone"
          value={data.telephone}
          onChange={onChange}
          className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">
          General Email
        </label>
        <input
          type="email"
          name="general"
          value={data.general}
          onChange={onChange}
          className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">
          Website Queries Email
        </label>
        <input
          type="email"
          name="websiteQueries"
          value={data.websiteQueries}
          onChange={onChange}
          className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          <Save size={16} />
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </form>
  )
);

RenderContact.displayName = "RenderContact";
RenderForm.displayName = "RenderForm";

const ContactUs: React.FC = () => {
  const { user } = useSession();
  const params = useParams();
  const vendorWebsite =
    typeof params?.vendor_website === "string" ? params.vendor_website : "";

  const { contacts, isLoading, error } = useContactData(vendorWebsite);
  const { update, create, remove } = useContactStore();

  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<ContactFormData>({
    city: "",
    telephone: "",
    general: "",
    websiteQueries: "",
  });

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleEdit = useCallback((contact: ContactInfo) => {
    setFormData({
      city: contact.city,
      telephone: contact.telephone,
      general: contact.general,
      websiteQueries: contact.websiteQueries,
    });
    setEditingId(contact.id);
    setIsEditing(true);
  }, []);

  const handleAdd = useCallback(() => {
    setFormData({
      city: "",
      telephone: "",
      general: "",
      websiteQueries: "",
    });
    setShowAddForm(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setShowAddForm(false);
    setEditingId(undefined);
    setFormData({
      city: "",
      telephone: "",
      general: "",
      websiteQueries: "",
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (editingId) {
          await update(editingId, formData);
          toast.success("Contact information updated successfully");
        } else {
          await create(formData);
          toast.success("Contact information added successfully");
        }
        handleCancel();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to save contact information";
        console.error("Error saving contact:", error);
        toast.error(errorMessage);
      }
    },
    [editingId, formData, update, create, handleCancel]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        window.confirm(
          "Are you sure you want to delete this contact information?"
        )
      ) {
        try {
          await remove(id);
          toast.success("Contact information deleted successfully");
        } catch (error) {
          toast.error("Failed to delete contact information");
        }
      }
    },
    [remove]
  );

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-white">Loading contact information...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white text-xl">CONTACT US</h3>
        {user?.role === "VENDOR" && !isEditing && !showAddForm && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Plus size={16} />
            Add Office
          </button>
        )}
      </div>

      {showAddForm && (
        <RenderForm
          data={formData}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onCancel={handleCancel}
        />
      )}

      <div className="space-y-4">
        {contacts.map((contact: ContactInfo) => (
          <div key={contact.id}>
            {editingId === contact.id ? (
              <RenderForm
                data={formData}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
                onCancel={handleCancel}
              />
            ) : (
              <RenderContact
                contact={contact}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isVendor={user?.role === "VENDOR"}
              />
            )}
          </div>
        ))}
      </div>

      {!contacts.length && !showAddForm && (
        <div className="text-center py-8 bg-gray-800 rounded-lg">
          <p className="text-gray-400">
            {user?.role === "VENDOR"
              ? "No contact information added yet. Add your first office location."
              : "No contact information available from the vendor."}
          </p>
          {user?.role === "VENDOR" && (
            <button
              onClick={handleAdd}
              className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors mx-auto"
            >
              <Plus size={16} />
              Add Office
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactUs;
