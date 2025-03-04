import './ContentCalendar.css';
import CalendarOverview from '../components/CalendarOverview';
import ArticleGenerator from '../components/ArticleGenerator';
import {useUser} from '@clerk/clerk-react'
import IdArticleGenerator from '../components/IdArticleGenerator';

function ContentCalendar() {
  const {user} = useUser()
  if (!user) {
    return <div>Please sign in to continue</div>
  }

  console.log("User ID being sent:", user.id);

  let form = null
  let table = null

  switch (user.id) {
    case 'user_2to4iIK0DdzKaPJLbxXXJ0NMiLJ':
      form = <IdArticleGenerator />   
      table = <CalendarOverview />  
      break
    case 'user_2tcq10lxmyCfQ69VBiX5NdAD8wc':
      form = <ArticleGenerator />
      table = <CalendarOverview />
      break
  }

  return (
    <div>
      <div className="content-calendar-container">
        <div className="form-container">
          {form}
        </div>
        <div className="table-container">
          {table}
        </div>
      </div>
    </div>
  );
}

export default ContentCalendar;


