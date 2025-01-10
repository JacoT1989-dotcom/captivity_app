"use client";

import React, { useState } from "react";
import { useSession } from "@/app/(vendor)/SessionProvider";
import { Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import {
  OpeningHoursInfo,
  useOpeningHoursData,
} from "../../welcome/_store/tradingHoursStore";

type OpeningHoursFormData = Omit<OpeningHoursInfo, "id" | "userSettingsId">;

interface RenderOpeningHoursProps {
  hours: OpeningHoursInfo;
  onEdit: (hours: OpeningHoursInfo) => void;
  onDelete: (id: string) => void;
  isVendor: boolean;
}

interface RenderFormProps {
  data: OpeningHoursFormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const RenderOpeningHours: React.FC<RenderOpeningHoursProps> = ({
  hours,
  onEdit,
  onDelete,
  isVendor,
}) => (
  <div className="mb-6 p-4 bg-gray-800 rounded-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-white text-lg">{hours.city}</h3>
      {isVendor && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(hours)}
            className="p-1.5 rounded hover:bg-gray-700 transition-colors"
            title="Edit opening hours"
          >
            <Pencil size={16} className="text-white" />
          </button>
          <button
            onClick={() => onDelete(hours.id)}
            className="p-1.5 rounded hover:bg-gray-700 transition-colors"
            title="Delete opening hours"
          >
            <Trash2 size={16} className="text-white" />
          </button>
        </div>
      )}
    </div>
    <div className="space-y-2 text-gray-300">
      <p>Monday – Thursday: {hours.mondayToThursday}</p>
      <p>Friday: {hours.friday}</p>
      <p>Saturday – Sunday: {hours.saturdaySunday}</p>
      <p>Public Holidays: {hours.publicHolidays}</p>
    </div>
  </div>
);

const RenderForm: React.FC<RenderFormProps> = ({
  data,
  onSubmit,
  onChange,
  onCancel,
}) => (
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
        Monday – Thursday Hours
      </label>
      <input
        type="text"
        name="mondayToThursday"
        value={data.mondayToThursday}
        onChange={onChange}
        className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        required
        placeholder="e.g., 8 am – 5 pm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-white">
        Friday Hours
      </label>
      <input
        type="text"
        name="friday"
        value={data.friday}
        onChange={onChange}
        className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        required
        placeholder="e.g., 8 am – 4 pm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-white">
        Saturday – Sunday Hours
      </label>
      <input
        type="text"
        name="saturdaySunday"
        value={data.saturdaySunday}
        onChange={onChange}
        className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        required
        placeholder="e.g., Closed"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-white">
        Public Holidays Hours
      </label>
      <input
        type="text"
        name="publicHolidays"
        value={data.publicHolidays}
        onChange={onChange}
        className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        required
        placeholder="e.g., Closed"
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
);

const OpeningHours: React.FC = () => {
  const { user } = useSession();
  const params = useParams();
  const vendorWebsite =
    typeof params?.vendor_website === "string" ? params.vendor_website : "";

  const { openingHours, isLoading, error, update, create, remove } =
    useOpeningHoursData(vendorWebsite);

  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<OpeningHoursFormData>({
    city: "",
    mondayToThursday: "",
    friday: "",
    saturdaySunday: "",
    publicHolidays: "",
  });

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (hours: OpeningHoursInfo) => {
    setFormData({
      city: hours.city,
      mondayToThursday: hours.mondayToThursday,
      friday: hours.friday,
      saturdaySunday: hours.saturdaySunday,
      publicHolidays: hours.publicHolidays,
    });
    setEditingId(hours.id);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setFormData({
      city: "",
      mondayToThursday: "",
      friday: "",
      saturdaySunday: "",
      publicHolidays: "",
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowAddForm(false);
    setEditingId(undefined);
    setFormData({
      city: "",
      mondayToThursday: "",
      friday: "",
      saturdaySunday: "",
      publicHolidays: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await update(editingId, formData);
        toast.success("Opening hours updated successfully");
      } else {
        await create(formData);
        toast.success("Opening hours added successfully");
      }
      handleCancel();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save opening hours";
      console.error("Error saving opening hours:", error);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete these opening hours?")
    ) {
      try {
        await remove(id);
        toast.success("Opening hours deleted successfully");
      } catch (error) {
        toast.error("Failed to delete opening hours");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-white">Loading opening hours...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white text-xl">OPENING HOURS</h3>
        {user?.role === "VENDOR" && !isEditing && !showAddForm && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Plus size={16} />
            Add Location
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
        {openingHours?.map((hours: OpeningHoursInfo) => (
          <div key={hours.id}>
            {editingId === hours.id ? (
              <RenderForm
                data={formData}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
                onCancel={handleCancel}
              />
            ) : (
              <RenderOpeningHours
                hours={hours}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isVendor={user?.role === "VENDOR"}
              />
            )}
          </div>
        ))}
      </div>

      {(!openingHours || openingHours.length === 0) && !showAddForm && (
        <div className="text-center py-8 bg-gray-800 rounded-lg">
          <p className="text-gray-400">
            {user?.role === "VENDOR"
              ? "No opening hours added yet. Add your first location hours."
              : "No opening hours available from the vendor."}
          </p>
          {user?.role === "VENDOR" && (
            <button
              onClick={handleAdd}
              className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors mx-auto"
            >
              <Plus size={16} />
              Add Location
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OpeningHours;
