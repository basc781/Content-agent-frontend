import "./ArticleGenerator.css";
import { useState } from "react";
import { generateArticle, validateFormData } from "../services/api";
import FeedbackModal from "./FeedbackModal";
import { FiLoader } from "react-icons/fi";
import { useUser } from "@clerk/clerk-react";
import { Module } from "../types/module";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormSchema } from "../types/type";

interface FormInputs {
  [key: string]: any;  // Dynamic fields from schema
  // Special fields that remain static
  titel: string;
  website: string;
  imageUrls: string;
  productDatabase: boolean;
}

interface ValidationResponse {
  formDataValidation: {
    valid: boolean;
    feedback: string[];
  };
}

function ArticleGeneratorForm({ module, formSchema }: { module: Module; formSchema: FormSchema }) {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      // Special fields
      titel: "",
      website: "",
      imageUrls: "",
      productDatabase: true,
      // Dynamic fields will be handled by the form
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResponse | null>(null);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await validateFormData(data);
      setValidationResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateArticle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("User not found");
      }
      console.log("User ID being sent:", user.id);
      generateArticle(watch(), module.id);
      setValidationResult(null);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setValidationResult(null);
  };

  return (
    <div className="article-generator">
      <div className="component-header">
        <h2>{formSchema.titel || module.title}</h2>
        <p>{module.description}</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title field - always present */}
        <div className="form-group">
          <label htmlFor="titel">TITEL</label>
          <input
            type="text"
            id="titel"
            {...register("titel", { required: true })}
            placeholder="Voer titel in"
            disabled={isLoading}
          />
          {errors.titel && (
            <span className="error">This field is required</span>
          )}
        </div>

        {/* Dynamic form fields from schema */}
        {formSchema.fields.map((field) => (
          <div key={field.id} className={field.type === 'date' ? 'form-row' : 'form-group'}>
            <label htmlFor={field.id}>{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                {...register(field.id, { required: field.required })}
                placeholder={field.placeholder}
                rows={4}
                disabled={isLoading}
              />
            ) : (
              <input
                type={field.type}
                id={field.id}
                {...register(field.id, { required: field.required })}
                placeholder={field.placeholder}
                disabled={isLoading}
              />
            )}
            {errors[field.id] && (
              <span className="error">This field is required</span>
            )}
          </div>
        ))}

        {/* Special fields that remain static */}
        {module.webScraper && (
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              {...register("website")}
              disabled={isLoading}
            />
          </div>
        )}

        {module.images && (
          <div className="form-group">
            <label htmlFor="imageUrls">Image URLs</label>
            <input
              type="text"
              id="imageUrls"
              {...register("imageUrls")}
              placeholder="Enter image URLs (comma separated)"
              disabled={isLoading}
            />
          </div>
        )}

        {module.productAPI && (
          <div className="form-group toggle-container">
            <label>Product Database</label>
            <div className="toggle-switch">
              <button
                type="button"
                className={`toggle-button ${watch("productDatabase") ? "active" : ""}`}
                onClick={() => {
                  const currentValue = watch("productDatabase");
                  register("productDatabase").onChange({
                    target: { value: !currentValue },
                  });
                }}
                disabled={isLoading}
              >
                {watch("productDatabase") ? "On" : "Off"}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`generate-article-button ${isLoading ? "loading" : ""}`}
        >
          {isLoading ? (
            <>
              <FiLoader className="spinner" />
              Aan het valideren, dit kan even duren...
            </>
          ) : (
            formSchema.submitLabel || "Generate Article"
          )}
        </button>
      </form>

      {validationResult && (
        <FeedbackModal
          isValid={validationResult.formDataValidation.valid}
          feedback={validationResult.formDataValidation.feedback}
          onClose={closeModal}
          onGenerate={handleGenerateArticle}
        />
      )}
    </div>
  );
}

export default ArticleGeneratorForm;
