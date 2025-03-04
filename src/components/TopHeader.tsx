import './TopHeader.css';

interface TopHeaderProps {
  backgroundImage: string;
  title: string;
}

function TopHeader({ backgroundImage, title }: TopHeaderProps) {
  return (
    <div 
      className="top-bar top-image large-image" 
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="background">
        <div className="wrap">
          <h1>{title}</h1>
        </div>
      </div>
    </div>
  );
}

export default TopHeader; 