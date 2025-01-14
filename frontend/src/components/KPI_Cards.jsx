
const KPI_Cards = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {data.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
          <h3 className="text-xl font-bold">{item.title}</h3>
          <p className="text-3xl">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPI_Cards;
