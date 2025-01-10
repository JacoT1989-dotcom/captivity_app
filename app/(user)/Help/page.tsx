"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createHelp, checkRemainingSubmissions } from "./actions";
import Questions from "./help-questions/page";
import toast from "react-hot-toast";
//hello
interface HelpMeItem {
  id: number;
  selectedOption: string;
  text: string;
}

interface FormData {
  name: string;
  companyName: string;
  email: string;
  assistanceType: string;
  suggestions: string[];
  helpRequests: HelpMeItem[];
  generalInfo: string[];
}

const HelpForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    companyName: "",
    email: "",
    assistanceType: "",
    suggestions: [],
    helpRequests: [{ id: 1, selectedOption: "", text: "" }],
    generalInfo: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingSubmissions, setRemainingSubmissions] = useState<
    number | null
  >(null);

  useEffect(() => {
    const checkLimit = async () => {
      if (formData.email) {
        const result = await checkRemainingSubmissions(formData.email);
        if (!("error" in result)) {
          setRemainingSubmissions(result.remainingSubmissions);
        }
      }
    };
    checkLimit();
  }, [formData.email]);

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        formData.assistanceType === "Suggestions" &&
        (!formData.suggestions || formData.suggestions.length === 0)
      ) {
        toast.error("Please add at least one suggestion");
        setIsSubmitting(false);
        return;
      }

      if (
        formData.assistanceType === "General Info" &&
        (!formData.generalInfo || formData.generalInfo.length === 0)
      ) {
        toast.error("Please add at least one general information item");
        setIsSubmitting(false);
        return;
      }

      // Fixed typing for the submission data
      const dataToSubmit: {
        name: string;
        companyName: string;
        email: string;
        assistanceType: string;
        suggestions?: string[];
        helpRequests?: Array<{
          id: number;
          selectedOption: string;
          text: string;
        }>;
        generalInfo?: string[];
      } = {
        name: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        assistanceType: formData.assistanceType,
      };

      // Add the relevant field based on assistanceType
      if (formData.assistanceType === "Suggestions") {
        dataToSubmit.suggestions = formData.suggestions.filter(
          s => s.trim() !== ""
        );
      } else if (formData.assistanceType === "HelpMe") {
        dataToSubmit.helpRequests = formData.helpRequests;
      } else if (formData.assistanceType === "General Info") {
        dataToSubmit.generalInfo = formData.generalInfo.filter(
          g => g.trim() !== ""
        );
      }

      console.log("Submitting data:", dataToSubmit);
      const result = await createHelp(dataToSubmit);

      if ("success" in result) {
        toast.success(result.message);
        setRemainingSubmissions(result.remainingSubmissions);
        setFormData({
          name: "",
          companyName: "",
          email: "",
          assistanceType: "",
          suggestions: [],
          helpRequests: [{ id: 1, selectedOption: "", text: "" }],
          generalInfo: [],
        });
        setErrors({});
      } else {
        if ("validationErrors" in result && result.validationErrors) {
          const newErrors: Record<string, string> = {};
          result.validationErrors.forEach(err => {
            newErrors[err.path] = err.message;
          });
          setErrors(newErrors);
          toast.error("Please check all required fields");
        } else if ("limitReached" in result) {
          toast.error(result.error);
          setRemainingSubmissions(0);
        } else {
          toast.error(result.error);
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = (
    type: "suggestions" | "helpRequests" | "generalInfo"
  ) => {
    setFormData(prev => {
      if (type === "helpRequests") {
        return {
          ...prev,
          helpRequests: [
            ...prev.helpRequests,
            { id: prev.helpRequests.length + 1, selectedOption: "", text: "" },
          ],
        };
      }
      // For suggestions and generalInfo, initialize with empty string
      const currentArray = prev[type] || [];
      return {
        ...prev,
        [type]: [...currentArray, ""],
      };
    });
  };

  const handleRemoveItem = (
    type: "suggestions" | "helpRequests" | "generalInfo",
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-blue-600">
          Send Us a Message
        </CardTitle>
        {remainingSubmissions !== null && (
          <p className="text-center text-gray-600">
            {remainingSubmissions > 0
              ? `You have ${remainingSubmissions} help request${remainingSubmissions === 1 ? "" : "s"} remaining`
              : "You have reached the maximum number of help requests"}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  clearError("name");
                }}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={e => {
                  setFormData(prev => ({
                    ...prev,
                    companyName: e.target.value,
                  }));
                  clearError("companyName");
                }}
                className={errors.companyName ? "border-red-500" : ""}
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm">{errors.companyName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                clearError("email");
              }}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>How can we assist you? *</Label>
            <Select
              onValueChange={value => {
                setFormData(prev => ({ ...prev, assistanceType: value }));
                clearError("assistanceType");
              }}
              value={formData.assistanceType}
            >
              <SelectTrigger
                className={errors.assistanceType ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select assistance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Suggestions">Suggestions</SelectItem>
                <SelectItem value="HelpMe">Please help me with</SelectItem>
                <SelectItem value="General Info">General Info</SelectItem>
              </SelectContent>
            </Select>
            {errors.assistanceType && (
              <p className="text-red-500 text-sm">{errors.assistanceType}</p>
            )}
          </div>

          {formData.assistanceType === "Suggestions" && (
            <div className="space-y-4">
              {formData.suggestions.map((suggestion, index) => (
                <div key={index} className="relative space-y-2">
                  <Label>Suggestion {index + 1}</Label>
                  <Textarea
                    value={suggestion}
                    onChange={e => {
                      const newSuggestions = [...formData.suggestions];
                      newSuggestions[index] = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        suggestions: newSuggestions,
                      }));
                      clearError("suggestions");
                    }}
                    placeholder="Enter your suggestion here..."
                    className={`min-h-32 ${errors.suggestions ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem("suggestions", index)}
                    className="mt-2"
                  >
                    <Minus className="w-4 h-4 mr-2" /> Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddItem("suggestions")}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Suggestion
              </Button>
              {errors.suggestions && (
                <p className="text-red-500 text-sm">{errors.suggestions}</p>
              )}
            </div>
          )}

          {formData.assistanceType === "HelpMe" && (
            <div className="space-y-4">
              {formData.helpRequests.map((request, index) => (
                <div key={request.id} className="space-y-4 p-4 border rounded">
                  <Select
                    value={request.selectedOption}
                    onValueChange={value => {
                      const newRequests = formData.helpRequests.map(req =>
                        req.id === request.id
                          ? { ...req, selectedOption: value }
                          : req
                      );
                      setFormData(prev => ({
                        ...prev,
                        helpRequests: newRequests,
                      }));
                      clearError("helpRequests");
                    }}
                  >
                    <SelectTrigger
                      className={errors.helpRequests ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select help type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Updating my information">
                        Updating my information
                      </SelectItem>
                      <SelectItem value="Placing an order">
                        Placing an order
                      </SelectItem>
                      <SelectItem value="Payment">Payment</SelectItem>
                      <SelectItem value="Return">Return</SelectItem>
                      <SelectItem value="I can't login my account">
                        I can not login to my account
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {request.selectedOption && (
                    <Textarea
                      value={request.text}
                      onChange={e => {
                        const newRequests = formData.helpRequests.map(req =>
                          req.id === request.id
                            ? { ...req, text: e.target.value }
                            : req
                        );
                        setFormData(prev => ({
                          ...prev,
                          helpRequests: newRequests,
                        }));
                        clearError("helpRequests");
                      }}
                      placeholder="Describe your issue..."
                      className={`min-h-32 ${errors.helpRequests ? "border-red-500" : ""}`}
                    />
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem("helpRequests", index)}
                  >
                    <Minus className="w-4 h-4 mr-2" /> Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddItem("helpRequests")}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Help Request
              </Button>
              {errors.helpRequests && (
                <p className="text-red-500 text-sm">{errors.helpRequests}</p>
              )}
            </div>
          )}

          {formData.assistanceType === "General Info" && (
            <div className="space-y-4">
              {formData.generalInfo.map((info, index) => (
                <div key={index} className="relative space-y-2">
                  <Label>General Information {index + 1}</Label>
                  <Textarea
                    value={info}
                    onChange={e => {
                      const newInfo = [...formData.generalInfo];
                      newInfo[index] = e.target.value;
                      setFormData(prev => ({ ...prev, generalInfo: newInfo }));
                      clearError("generalInfo");
                    }}
                    placeholder="Enter general information..."
                    className={`min-h-32 ${errors.generalInfo ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem("generalInfo", index)}
                    className="mt-2"
                  >
                    <Minus className="w-4 h-4 mr-2" /> Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddItem("generalInfo")}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Information
              </Button>
              {errors.generalInfo && (
                <p className="text-red-500 text-sm">{errors.generalInfo}</p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || remainingSubmissions === 0}
          >
            {isSubmitting
              ? "Sending..."
              : remainingSubmissions === 0
                ? "Maximum submissions reached"
                : "Send Message"}
          </Button>
        </form>
      </CardContent>

      <Questions />
    </Card>
  );
};

export default HelpForm;
