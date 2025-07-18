CREATE TYPE "public"."unavailability_cause" AS ENUM('pauza', 'programare_offline', 'alta_situatie');--> statement-breakpoint
CREATE TABLE "unavailabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stylist_id" uuid NOT NULL,
	"date" date NOT NULL,
	"start_time" time,
	"end_time" time,
	"cause" "unavailability_cause" NOT NULL,
	"all_day" boolean DEFAULT false NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "unavailabilities" ADD CONSTRAINT "unavailabilities_stylist_id_stylists_id_fk" FOREIGN KEY ("stylist_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action;