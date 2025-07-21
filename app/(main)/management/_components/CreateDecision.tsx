interface Props {
  department: string;
}

const CreateDecision = ({ department }: Props) => {
  return (
    <div className="border p-4">
      <h3>Create Decision for {department}</h3>
      {/* Your form here */}
    </div>
  );
};

export default CreateDecision;
