CREATE TABLE "stylists" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"description" text,
	"profile_picture" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "stylists_email_unique" UNIQUE("email"),
	CONSTRAINT "stylists_phone_unique" UNIQUE("phone")
);
