export const validateEmail = (value: string): boolean => {
  const emailRegex = /^[\w-/.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return emailRegex.test(value);
};

export const validatePhone = (value: string): boolean => {
  const phoneRegex =
    /^(?:(?:\+|00)?(55)\s?)?(?:(?:\(?[1-9][0-9]\)?)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/;
  return phoneRegex.test(value);
};

export const validateAuthorName = (value: string): boolean => {
  const authorNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-]+$/;
  return authorNameRegex.test(value);
};

export const validateIsbn = (value: string): boolean => {
  const isbnRegex = /^(?:ISBN(?:-13)?:? )?(\d{3})(?:(\d{9})|(?=[\d -]{14}$)[ -](\d{1,5})[ -](\d{1,7})[ -](\d{1,6})[ -])(\d)$/;
  return isbnRegex.test(value);
};
