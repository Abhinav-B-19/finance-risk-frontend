interface PageContainerProps {
    children: React.ReactNode;
  }
  
  const PageContainer = ({ children }: PageContainerProps) => {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        {children}
      </div>
    );
  };
  
  export default PageContainer;