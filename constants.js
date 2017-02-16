
const credits = {
  minimum: 17,
  maximum: 27,
};
const majorCredits = {
  minimum: 14,
  maximum: 1000,
};

let baseUrl;
if (process.env.NODE_ENV === 'production') {
  baseUrl = '';
} else {
  baseUrl = 'http://localhost:9000';
}

exports.credits = credits;
exports.majorCredits = majorCredits;
exports.baseUrl = baseUrl;
