--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: deploys; Type: TABLE; Schema: public; Owner: _octopush
--

CREATE TABLE deploys (
    id integer NOT NULL,
    branch character varying(255) NOT NULL,
    log_file character varying(255) NOT NULL,
    hosts json NOT NULL,
    user_id integer NOT NULL,
    stack_id integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE deploys OWNER TO _octopush;

--
-- Name: deploys_id_seq; Type: SEQUENCE; Schema: public; Owner: _octopush
--

CREATE SEQUENCE deploys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE deploys_id_seq OWNER TO _octopush;

--
-- Name: deploys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: _octopush
--

ALTER SEQUENCE deploys_id_seq OWNED BY deploys.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: _octopush
--

CREATE TABLE groups (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    stack_id integer NOT NULL
);


ALTER TABLE groups OWNER TO _octopush;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: _octopush
--

CREATE SEQUENCE groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE groups_id_seq OWNER TO _octopush;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: _octopush
--

ALTER SEQUENCE groups_id_seq OWNED BY groups.id;


--
-- Name: groups_servers; Type: TABLE; Schema: public; Owner: _octopush
--

CREATE TABLE groups_servers (
    id integer NOT NULL,
    group_id integer NOT NULL,
    server_id integer NOT NULL
);


ALTER TABLE groups_servers OWNER TO _octopush;

--
-- Name: groups_servers_id_seq; Type: SEQUENCE; Schema: public; Owner: _octopush
--

CREATE SEQUENCE groups_servers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE groups_servers_id_seq OWNER TO _octopush;

--
-- Name: groups_servers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: _octopush
--

ALTER SEQUENCE groups_servers_id_seq OWNED BY groups_servers.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: _octopush
--

CREATE TABLE migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE migrations OWNER TO _octopush;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: _octopush
--

CREATE SEQUENCE migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE migrations_id_seq OWNER TO _octopush;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: _octopush
--

ALTER SEQUENCE migrations_id_seq OWNED BY migrations.id;


--
-- Name: migrations_lock; Type: TABLE; Schema: public; Owner: _octopush
--

CREATE TABLE migrations_lock (
    is_locked integer
);


ALTER TABLE migrations_lock OWNER TO _octopush;

--
-- Name: servers; Type: TABLE; Schema: public; Owner: _octopush
--

CREATE TABLE servers (
    id integer NOT NULL,
    hostname character varying(255) NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE servers OWNER TO _octopush;

--
-- Name: servers_id_seq; Type: SEQUENCE; Schema: public; Owner: _octopush
--

CREATE SEQUENCE servers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE servers_id_seq OWNER TO _octopush;

--
-- Name: servers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: _octopush
--

ALTER SEQUENCE servers_id_seq OWNED BY servers.id;


--
-- Name: servers_stacks; Type: TABLE; Schema: public; Owner: _octopush
--

CREATE TABLE servers_stacks (
    id integer NOT NULL,
    stack_id integer NOT NULL,
    server_id integer NOT NULL
);


ALTER TABLE servers_stacks OWNER TO _octopush;

--
-- Name: servers_stacks_id_seq; Type: SEQUENCE; Schema: public; Owner: _octopush
--

CREATE SEQUENCE servers_stacks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE servers_stacks_id_seq OWNER TO _octopush;

--
-- Name: servers_stacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: _octopush
--

ALTER SEQUENCE servers_stacks_id_seq OWNED BY servers_stacks.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: _octopush
--

CREATE TABLE sessions (
    sid character varying(255) NOT NULL,
    sess json NOT NULL,
    expired timestamp with time zone NOT NULL
);


ALTER TABLE sessions OWNER TO _octopush;

--
-- Name: stacks; Type: TABLE; Schema: public; Owner: _octopush
--

CREATE TABLE stacks (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    git_path character varying(255) NOT NULL,
    diff character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE stacks OWNER TO _octopush;

--
-- Name: stacks_id_seq; Type: SEQUENCE; Schema: public; Owner: _octopush
--

CREATE SEQUENCE stacks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE stacks_id_seq OWNER TO _octopush;

--
-- Name: stacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: _octopush
--

ALTER SEQUENCE stacks_id_seq OWNED BY stacks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: _octopush
--

CREATE TABLE users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    reset_password_token character varying(255),
    reset_password_expires timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE users OWNER TO _octopush;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: _octopush
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO _octopush;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: _octopush
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY deploys ALTER COLUMN id SET DEFAULT nextval('deploys_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY groups ALTER COLUMN id SET DEFAULT nextval('groups_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY groups_servers ALTER COLUMN id SET DEFAULT nextval('groups_servers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY migrations ALTER COLUMN id SET DEFAULT nextval('migrations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY servers ALTER COLUMN id SET DEFAULT nextval('servers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY servers_stacks ALTER COLUMN id SET DEFAULT nextval('servers_stacks_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY stacks ALTER COLUMN id SET DEFAULT nextval('stacks_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: deploys; Type: TABLE DATA; Schema: public; Owner: _octopush
--

COPY deploys (id, branch, log_file, hosts, user_id, stack_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: deploys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: _octopush
--

SELECT pg_catalog.setval('deploys_id_seq', 1, false);


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: _octopush
--

COPY groups (id, name, stack_id) FROM stdin;
1	SYDNEY	1
2	BRISBANE	1
\.


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: _octopush
--

SELECT pg_catalog.setval('groups_id_seq', 2, true);


--
-- Data for Name: groups_servers; Type: TABLE DATA; Schema: public; Owner: _octopush
--

COPY groups_servers (id, group_id, server_id) FROM stdin;
1	1	1
2	1	2
3	2	3
\.


--
-- Name: groups_servers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: _octopush
--

SELECT pg_catalog.setval('groups_servers_id_seq', 3, true);


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: _octopush
--

COPY migrations (id, name, batch, migration_time) FROM stdin;
1	20160820203159_init.js	1	2016-10-04 22:00:36.413+00
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: _octopush
--

SELECT pg_catalog.setval('migrations_id_seq', 1, true);


--
-- Data for Name: migrations_lock; Type: TABLE DATA; Schema: public; Owner: _octopush
--

COPY migrations_lock (is_locked) FROM stdin;
0
\.


--
-- Data for Name: servers; Type: TABLE DATA; Schema: public; Owner: _octopush
--

COPY servers (id, hostname, created_at, updated_at) FROM stdin;
1	syd01.foobar.com	2016-10-04 22:02:26.163757+00	2016-10-04 22:02:26.163757+00
2	syd02.foobar.com	2016-10-04 22:02:51.184389+00	2016-10-04 22:02:51.184389+00
3	bri01.foobar.com	2016-10-04 22:02:56.846851+00	2016-10-04 22:02:56.846851+00
\.


--
-- Name: servers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: _octopush
--

SELECT pg_catalog.setval('servers_id_seq', 3, true);


--
-- Data for Name: servers_stacks; Type: TABLE DATA; Schema: public; Owner: _octopush
--

COPY servers_stacks (id, stack_id, server_id) FROM stdin;
1	1	1
2	1	2
3	1	3
\.


--
-- Name: servers_stacks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: _octopush
--

SELECT pg_catalog.setval('servers_stacks_id_seq', 3, true);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: _octopush
--

COPY sessions (sid, sess, expired) FROM stdin;
\.


--
-- Data for Name: stacks; Type: TABLE DATA; Schema: public; Owner: _octopush
--

COPY stacks (id, title, slug, git_path, diff, created_at, updated_at) FROM stdin;
1	My Application	my-application	/opt/git/repos	https://atickettracker.com/test?from={{from}}&to={{to}}	2016-10-04 22:05:50.940835+00	2016-10-04 22:05:50.940835+00
\.


--
-- Name: stacks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: _octopush
--

SELECT pg_catalog.setval('stacks_id_seq', 1, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: _octopush
--

COPY users (id, name, email, password, reset_password_token, reset_password_expires, created_at, updated_at) FROM stdin;
1	Joe Blog	joe@blog.com	$2a$10$9sGt6cof2.vWTyCS9UnaYOmqAomUxdiQv.DqtDx6Fxl5CMZPYedhW	\N	\N	2016-10-04 22:01:22.60221+00	2016-10-04 22:01:22.60221+00
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: _octopush
--

SELECT pg_catalog.setval('users_id_seq', 1, true);


--
-- Name: deploys_pkey; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY deploys
    ADD CONSTRAINT deploys_pkey PRIMARY KEY (id);


--
-- Name: groups_pkey; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: groups_servers_pkey; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY groups_servers
    ADD CONSTRAINT groups_servers_pkey PRIMARY KEY (id);


--
-- Name: migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: servers_hostname_unique; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY servers
    ADD CONSTRAINT servers_hostname_unique UNIQUE (hostname);


--
-- Name: servers_pkey; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY servers
    ADD CONSTRAINT servers_pkey PRIMARY KEY (id);


--
-- Name: servers_stacks_pkey; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY servers_stacks
    ADD CONSTRAINT servers_stacks_pkey PRIMARY KEY (id);


--
-- Name: sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: stacks_pkey; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY stacks
    ADD CONSTRAINT stacks_pkey PRIMARY KEY (id);


--
-- Name: stacks_slug_unique; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY stacks
    ADD CONSTRAINT stacks_slug_unique UNIQUE (slug);


--
-- Name: stacks_title_unique; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY stacks
    ADD CONSTRAINT stacks_title_unique UNIQUE (title);


--
-- Name: users_email_unique; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_reset_password_token_unique; Type: CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_reset_password_token_unique UNIQUE (reset_password_token);


--
-- Name: deploys_stack_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY deploys
    ADD CONSTRAINT deploys_stack_id_foreign FOREIGN KEY (stack_id) REFERENCES stacks(id);


--
-- Name: deploys_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY deploys
    ADD CONSTRAINT deploys_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: groups_servers_group_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY groups_servers
    ADD CONSTRAINT groups_servers_group_id_foreign FOREIGN KEY (group_id) REFERENCES groups(id);


--
-- Name: groups_servers_server_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY groups_servers
    ADD CONSTRAINT groups_servers_server_id_foreign FOREIGN KEY (server_id) REFERENCES servers(id);


--
-- Name: groups_stack_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT groups_stack_id_foreign FOREIGN KEY (stack_id) REFERENCES stacks(id);


--
-- Name: servers_stacks_server_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY servers_stacks
    ADD CONSTRAINT servers_stacks_server_id_foreign FOREIGN KEY (server_id) REFERENCES servers(id);


--
-- Name: servers_stacks_stack_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: _octopush
--

ALTER TABLE ONLY servers_stacks
    ADD CONSTRAINT servers_stacks_stack_id_foreign FOREIGN KEY (stack_id) REFERENCES stacks(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--
