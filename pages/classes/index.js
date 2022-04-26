import Class from '../../models/class';
import dbConnect from '../../lib/dbConnect';

function Classes({ classes }) {
  return (
    <div>
      <h1>Classes</h1>
      <ul>
        {classes.map(({ _id, name, url }) => (
          <li key={_id}>
            <h2>{name}</h2>
            <p>{url}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Classes;

export async function getServerSideProps() {
  await dbConnect();

  /* find all the data in our database */
  const result = await Class.find({});
  const classes = result.map((doc) => {
    const dndClass = doc.toObject();
    dndClass._id = dndClass._id.toString();
    return dndClass;
  });

  return { props: { classes: classes } };
}
