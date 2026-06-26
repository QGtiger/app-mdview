CREATE TABLE "app-mdview"."shares" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "app-mdview"."shares_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(16) NOT NULL,
	"content" text NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"secretToken" varchar(64) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp,
	CONSTRAINT "shares_slug_unique" UNIQUE("slug"),
	CONSTRAINT "shares_secretToken_unique" UNIQUE("secretToken")
);
--> statement-breakpoint
CREATE TABLE "app-mdview"."users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "app-mdview"."users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"displayName" varchar(255) NOT NULL,
	"phone" varchar(50),
	"remark" varchar(500),
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
