CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text,
	"created_at" timestamp with time zone DEFAULT now()
);
