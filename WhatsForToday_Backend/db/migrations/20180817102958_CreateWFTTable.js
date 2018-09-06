
exports.up = function(knex, Promise) {
    return knex.schema.createTable("users", table => {
        table.increments('id').primary();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.date('date_of_birth').notNullable();
        table.string("email").unique().notNullable();
        table.string("password_digest").notNullable();
        table.boolean("is_admin").defaultTo(false);
        table.text("address_line1").notNullable();
        table.text("address_line2").nullable();
        table.string("city").notNullable();
        table.string("state").notNullable();
        table.string("country").notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now())
        table.timestamp('last_login').defaultTo(knex.fn.now())

    }).createTable("categories", table => {
        table.increments("id").primary();
        table.string("name").unique().notNullable();
        table.boolean("is_published").defaultTo(true);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    }).createTable("users_categories", table => {
        table.increments("id").primary();
        table.integer('user_id').unsigned().notNullable().references('users.id');
        table.integer('category_id').unsigned().notNullable().references('categories.id');
        table.integer('preference').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    }).createTable("articles", table => {
        table.increments("id").primary();
        table.integer('author_id').unsigned().notNullable().references('users.id');
        table.integer('category_id').unsigned().notNullable().references('categories.id');
        table.string("title").unique().notNullable();
        table.string("search_keyword").nullable();
        table.string('wiki_url').nullable();
        table.text("body").notNullable();
        table.integer("view_count").unsigned().notNullable().defaultTo(0);
        table.integer("like_count").unsigned().notNullable().defaultTo(0);
        table.integer("bookmark_count").unsigned().notNullable().defaultTo(0);
        table.boolean("is_populated").defaultTo(false);
        table.boolean("is_published_in_public").defaultTo(false);
        table.boolean("is_topic_of_the_day_in_public").defaultTo(false);
        table.boolean("is_approved").defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('published_in_public_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('last_viewed_at').defaultTo(knex.fn.now());

    }).createTable("users_articles", table => {
        table.increments("id").primary();
        table.integer('user_id').unsigned().notNullable().references('users.id');
        table.integer('article_id').unsigned().notNullable().references('articles.id');
        table.boolean("is_liked").defaultTo(false);
        table.boolean("is_bookmarked").defaultTo(false);
        table.boolean("is_commented_on").defaultTo(false);
        table.boolean("is_topic_of_the_day_for_user").defaultTo(true);
        table.integer("view_count").unsigned().notNullable().defaultTo(0);
        table.timestamp('published_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('last_viewed_at').defaultTo(knex.fn.now());

    }).createTable("comments", table => {
        table.increments("id").primary();
        table.integer('user_id').unsigned().notNullable().references('users.id');
        table.integer('article_id').unsigned().notNullable().references('articles.id');
        table.text("body").notNullable();
        table.boolean("is_published").defaultTo(true);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('published_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    }).createTable("images", table => {
        table.increments("id").primary();
        table.integer('article_id').unsigned().notNullable().references('articles.id');
        table.text("url").notNullable();
        table.string("title").notNullable();
        table.integer("width").notNullable();
        table.integer("height").notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    }).createTable("videos", table => {
        table.increments("id").primary();
        table.integer('article_id').unsigned().notNullable().references('articles.id');
        table.string("video_id").notNullable();
        table.string("title").notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    }).createTable("tags", table => {
        table.increments("id").primary();
        table.string("title").unique().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    }).createTable("articles_tags", table => {
        table.increments("id").primary();
        table.integer('article_id').unsigned().notNullable().references('articles.id');
        table.integer('tag_id').unsigned().notNullable().references('tags.id');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    }).then(() => {
        console.log('All Tables are Created!');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("articles_tags")
    .dropTableIfExists("tags")
    .dropTableIfExists("videos")
    .dropTableIfExists("images")
    .dropTableIfExists("comments")
    .dropTableIfExists("users_articles")
    .dropTableIfExists("articles")
    .dropTableIfExists("users_categories")
    .dropTableIfExists("categories")
    .dropTableIfExists("users");
};