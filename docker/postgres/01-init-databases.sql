CREATE DATABASE auth_db;
CREATE DATABASE user_db;
CREATE DATABASE product_db;
CREATE DATABASE cart_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE notification_db;
CREATE DATABASE analytics_db;

\connect auth_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect user_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect product_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect cart_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect order_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect payment_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect notification_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect analytics_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";