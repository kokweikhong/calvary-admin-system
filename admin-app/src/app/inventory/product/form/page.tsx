"use client";

export default function ProductFormPage() {
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("submit");
    console.log(event);
    // get the form data
    const formData = new FormData();
    formData.append("file", (event.target as HTMLFormElement).file.files[0]);
    formData.append("saveDir", "test");
    console.log(formData);
    const res = await fetch("http://localhost:8080/api/v1/filesystem/uploads", {
      method: "POST",
      body: formData,
    });

    console.log(res);
  }

  return (
    <div>
      <h1>Product Form</h1>
      <div>
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <input name="file" type="file" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
