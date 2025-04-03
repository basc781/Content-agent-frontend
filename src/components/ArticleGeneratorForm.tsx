import "./ArticleGenerator.css";
import { useState } from "react";
import { generateArticle, validateFormData } from "../services/api";
import FeedbackModal from "./FeedbackModal";
import { FiLoader } from "react-icons/fi";
import { useUser } from "@clerk/clerk-react";
import { Module } from "../types/module";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormInputs {
  titel: string;
  event: string;
  beschrijving: string;
  potentialKeywords: string;
  datum: string;
  winkelvoorbeelden: string;
  productDatabase: boolean;
  website: string;
  imageUrls: string;
}

interface ValidationResponse {
  formDataValidation: {
    valid: boolean;
    feedback: string[];
  };
}

function ArticleGeneratorForm({ module }: { module: Module }) {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      titel: "",
      beschrijving: "",
      potentialKeywords: "",
      datum: "",
      winkelvoorbeelden: "",
      productDatabase: true,
      website: "",
      imageUrls: "",
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
        <h2>{module.title}</h2>
        <p>{module.description}</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="titel">Title</label>
          <input
            type="text"
            id="titel"
            {...register("titel", { required: true })}
            placeholder="Enter article title"
            disabled={isLoading}
          />
          {errors.titel && (
            <span className="error">This field is required</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="beschrijving">Description</label>
          <textarea
            id="beschrijving"
            {...register("beschrijving", { required: true })}
            placeholder="Enter description"
            rows={4}
            disabled={isLoading}
          />
          {errors.beschrijving && (
            <span className="error">This field is required</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="potentialKeywords">Keywords</label>
            <input
              type="text"
              id="potentialKeywords"
              {...register("potentialKeywords", { required: true })}
              placeholder="Enter keywords (comma separated)"
              disabled={isLoading}
            />
            {errors.potentialKeywords && (
              <span className="error">This field is required</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="datum">Date</label>
            <input
              type="date"
              id="datum"
              {...register("datum", { required: true })}
              disabled={isLoading}
            />
            {errors.datum && (
              <span className="error">This field is required</span>
            )}
          </div>
        </div>

        {module.webScraper && (
          <div className="form-group">
            <label htmlFor="website">Website (sitemap.xml)</label>
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
                className={`toggle-button ${
                  watch("productDatabase") ? "active" : ""
                }`}
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
            "Generate Article"
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
