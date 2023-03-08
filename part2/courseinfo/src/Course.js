const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ parts }) => {
  const sum = parts.reduce((result, element) => result += element.exercises, 0)
  return (
    <b>total of {sum} exercises</b>
  )
}

const Part = ({ part }) =>
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) =>
  <>
    {parts.map(part => <Part key={part.id} part={part} />)}
  </>

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course