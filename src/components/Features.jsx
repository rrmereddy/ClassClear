const feature = [
  {
    title: 'Feature 1',
    description: 'Description 1',
  },
  {
    title: 'Feature 2',
    description: 'Description 2',
  },
  {
    title: 'Feature 3',
    description: 'Description 3',
  },
]
const Features = () => {

  return (
      <div className="container">
        <div className="text-center mt-16">
          <h2 id='' className="text-5xl font-bold text-primary_color mb-6">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feature.map((feature, index) => (
              <div key={index} className="glass p-4">
                <h3 className="text-2xl font-bold text-primary_color mb-4">{feature.title}</h3>
                <p className="text-lg text-tertiary_color">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default Features