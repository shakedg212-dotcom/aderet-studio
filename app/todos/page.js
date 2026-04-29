import { createClient } from "../../utils/supabase/server";

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: todos, error } = await supabase.from("todos").select();
  const missingTable = error?.message?.includes("Could not find the table");
  const sqlSetup = `create table if not exists public.todos (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamp with time zone default now()
);

alter table public.todos enable row level security;

create policy "Allow read todos for anon"
on public.todos
for select
to anon
using (true);

insert into public.todos (name)
values ('טלית בהתאמה אישית'), ('הוספת שם רקום');`;

  return (
    <main style={{ padding: "40px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "16px" }}>בדיקת חיבור Supabase</h1>
      {missingTable ? (
        <>
          <p style={{ marginBottom: "14px", lineHeight: 1.7 }}>
            החיבור עובד, אבל עדיין לא נוצרה טבלה בשם <b>todos</b>.
            <br />
            פתח ב-Supabase את SQL Editor, הדבק את הקוד הבא ולחץ Run.
          </p>
          <pre
            style={{
              background: "#111",
              color: "#f7f3ec",
              padding: "16px",
              borderRadius: "8px",
              overflowX: "auto",
              direction: "ltr",
            }}
          >
            {sqlSetup}
          </pre>
        </>
      ) : error ? (
        <p>שגיאה בטעינה: {error.message}</p>
      ) : (
        <ul>
          {todos?.map((todo) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
