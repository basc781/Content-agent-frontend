import "./ContentCalendar.css";
import CalendarOverview from "../components/CalendarOverview";
import ArticleGeneratorForm from "../components/ArticleGeneratorForm";
import { useOrganization } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getModule } from "../services/api";
import { Module } from "../types/module"
import { useUser } from "@clerk/clerk-react";

function ContentCalendar() {  
  const { user } = useUser();
  console.log("Dit is de user", user);
  const { slug } = useParams<{ slug: string }>();
  console.log('dit is de slugGGGG',slug)
  const { organization } = useOrganization();
  console.log("Dit is de organization", organization);

  const [module, setModule] = useState<Module | null>(null);

  useEffect(() => {
    const fetchModule = async () => {
      const module = await getModule(slug ?? "");
      console.log("DIT IS ALTIJD HET GETAL DAT JE NODIG HEBT", module.orgModuleAccess[0].id);
      console.log('dit is de module type',module.outputFormat)
      setModule(module);
      
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
