export default async function Drop({params}: {params: Promise<{id: string}>}) {
  const id = (await params).id

  return (
    <main>
        <h1>Drop {id}</h1>
    </main>
  )
}