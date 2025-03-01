from models.newsletter import NewsletterEmailIn, NewsletterEmailOut
from typing import Optional
from queries.pool import pool
import logging


class NewsLetterEmails:
    def store_subscriber_email(
        self, newsletter_email: NewsletterEmailIn
    ) -> Optional[NewsletterEmailOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO newsletter_subscribers (subscriber_email)
                        VALUES (%s)
                        RETURNING id, subscriber_email;
                        """,
                        [newsletter_email.subscriber_email],
                    )
                    result = cur.fetchone()
                    if result:
                        return NewsletterEmailOut(
                            id=result[0], subscriber_email=result[1]
                        )
                    return None
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return None
