"use client";

import React, { useState, useCallback } from "react";
import { Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/app/(vendor)/SessionProvider";
import { useParams } from "next/navigation";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import {
  SocialLink,
  useSocialLinkData,
  useSocialLinkStore,
} from "../../welcome/_store/SocialStore";

interface IconProps {
  size?: number;
  className?: string;
}

type SocialLinkFormData = Omit<SocialLink, "id" | "userSettingsId">;

interface RenderLinkProps {
  link: SocialLink;
  onEdit: (link: SocialLink) => void;
  onDelete: (id: string) => void;
  isVendor: boolean;
}

interface RenderFormProps {
  data: SocialLinkFormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCancel: () => void;
}

const platformIcons: { [key: string]: React.ComponentType<IconProps> } = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Youtube: FaYoutube,
  Twitter: FaTwitter,
  LinkedIn: FaLinkedin,
};

const RenderLink: React.FC<RenderLinkProps> = React.memo(
  ({ link, onEdit, onDelete, isVendor }) => {
    const Icon = platformIcons[link.platform] || FaFacebook;

    return (
      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg mb-4">
        <div className="flex items-center">
          <Icon className="text-white hover:text-gray-500" size={20} />
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 text-white hover:text-red-600"
          >
            {link.platform}
          </a>
        </div>
        {isVendor && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(link)}
              className="p-1.5 rounded hover:bg-gray-700 transition-colors"
              title="Edit link"
            >
              <Pencil size={16} className="text-white" />
            </button>
            <button
              onClick={() => onDelete(link.id)}
              className="p-1.5 rounded hover:bg-gray-700 transition-colors"
              title="Delete link"
            >
              <Trash2 size={16} className="text-white" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

const RenderForm: React.FC<RenderFormProps> = React.memo(
  ({ data, onSubmit, onChange, onCancel }) => (
    <form
      onSubmit={onSubmit}
      className="space-y-4 bg-gray-800 p-4 rounded-lg mt-4"
    >
      <div>
        <label className="block text-sm font-medium text-white">Platform</label>
        <select
          name="platform"
          value={data.platform}
          onChange={onChange}
          className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
          required
        >
          <option value="">Select Platform</option>
          {Object.keys(platformIcons).map(platform => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-white">URL</label>
        <input
          type="url"
          name="url"
          value={data.url}
          onChange={onChange}
          className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
          placeholder="https://..."
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

RenderLink.displayName = "RenderLink";
RenderForm.displayName = "RenderForm";

const SocialLinks: React.FC = () => {
  const { user } = useSession();
  const params = useParams();
  const vendorWebsite =
    typeof params?.vendor_website === "string" ? params.vendor_website : "";

  const { links, isLoading, error } = useSocialLinkData(vendorWebsite);
  const { update, create, remove } = useSocialLinkStore();

  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<SocialLinkFormData>({
    platform: "",
    url: "",
  });

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleEdit = useCallback((link: SocialLink) => {
    setFormData({
      platform: link.platform,
      url: link.url,
    });
    setEditingId(link.id);
    setIsEditing(true);
  }, []);

  const handleAdd = useCallback(() => {
    setFormData({
      platform: "",
      url: "",
    });
    setShowAddForm(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setShowAddForm(false);
    setEditingId(undefined);
    setFormData({
      platform: "",
      url: "",
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (editingId) {
          await update(editingId, formData);
          toast.success("Social link updated successfully");
        } else {
          await create(formData);
          toast.success("Social link added successfully");
        }
        handleCancel();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save social link";
        console.error("Error saving social link:", error);
        toast.error(errorMessage);
      }
    },
    [editingId, formData, update, create, handleCancel]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this social link?")) {
        try {
          await remove(id);
          toast.success("Social link deleted successfully");
        } catch (error) {
          toast.error("Failed to delete social link");
        }
      }
    },
    [remove]
  );

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-white">Loading social links...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white text-xl">FOLLOW US</h3>
        {user?.role === "VENDOR" && !isEditing && !showAddForm && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Plus size={16} />
            Add Social Link
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
        {links.map((link: SocialLink) => (
          <div key={link.id}>
            {editingId === link.id ? (
              <RenderForm
                data={formData}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
                onCancel={handleCancel}
              />
            ) : (
              <RenderLink
                link={link}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isVendor={user?.role === "VENDOR"}
              />
            )}
          </div>
        ))}
      </div>

      {!links.length && !showAddForm && (
        <div className="text-center py-8 bg-gray-800 rounded-lg">
          <p className="text-gray-400">
            {user?.role === "VENDOR"
              ? "No social links added yet. Add your first social media link."
              : "No social media links available from the vendor."}
          </p>
          {user?.role === "VENDOR" && (
            <button
              onClick={handleAdd}
              className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors mx-auto"
            >
              <Plus size={16} />
              Add Social Link
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialLinks;
