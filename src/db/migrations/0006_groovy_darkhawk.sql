CREATE TYPE "public"."service_category" AS ENUM('haircut', 'coloring', 'styling', 'treatment', 'other');--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"duration" integer NOT NULL,
	"category" "service_category" DEFAULT 'other',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stylists_to_services" (
	"stylist_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	CONSTRAINT "stylists_to_services_stylist_id_service_id_pk" PRIMARY KEY("stylist_id","service_id")
);
--> statement-breakpoint
ALTER TABLE "stylists_to_services" ADD CONSTRAINT "stylists_to_services_stylist_id_stylists_id_fk" FOREIGN KEY ("stylist_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stylists_to_services" ADD CONSTRAINT "stylists_to_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;