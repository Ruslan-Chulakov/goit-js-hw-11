function searchRequestValidation(str) {
    return str
      .trim()
      .split(' ')
      .filter(el => el !== '')
      .join('+');
  };

export {searchRequestValidation};