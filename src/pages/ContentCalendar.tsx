import "./ContentCalendar.css";
import CalendarOverview from "../components/CalendarOverview";
import ArticleGeneratorForm from "../components/ArticleGeneratorForm";
import { useOrganization } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getModule } from "../services/api";
import { Module } from "../types/module"

function ContentCalendar() {  
  const { slug } = useParams<{ slug: string }>();
  const { organization } = useOrganization();

  const [module, setModule] = useState<Module | null>(null);

  useEffect(() => {
    const fetchModule = async () => {
      const module = await getModule(slug ?? "");
      setModule(module);
      console.log("Dit is de module", module);
    };
    fetchModule();
  }, [slug]);

  if (!slug) {
    return <div>Please select a module to continue</div>;
  }

  if (!organization) {
    return <div>Please select an organization to continue</div>;
  }

  if (!module) {
    return null;
  }

  return (
    <div>
      <div className="content-calendar-container">
        <div className="form-container">
          <ArticleGeneratorForm 
            module={module} 
            formSchema={module.orgModuleAccess[0].formSchema.schema} 
          />
        </div>
        <div className="table-container">
          <CalendarOverview moduleId={module.id.toString()} />
        </div>
      </div>
    </div>
  );
}

export default ContentCalendar;
