import './Body.css';

interface BodyProps {
  children?: React.ReactNode;
}

function Body({ children }: BodyProps) {
  return (
    <div className="body-container">
      {children}
    </div>
  );
}

export default Body; 