import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { format as dateTimeFormat, parse as parseDateTime, isValid } from 'date-fns';

import { en } from '../locales';
import { currencyFormats, dateTimeFormats, stringFormats } from '../locales/en';

import env from './env';

type value = string | number | Date;

const FALLBACK_LANG = 'en';

const isScalarTime = (value: value): boolean => value > 0 && value < 2359;
const scalarToDateTime = (value: number): Date => new Date(0, 0, 0, value / 100, value % 100);

const checkFormat = (
  formats: object,
  desiredFormat: string,
): boolean => Object.values(formats).some((x) => x === desiredFormat);

const isDateTimeFormat = (format: string): boolean => checkFormat(dateTimeFormats, format);
const isStringFormat = (format: string): boolean => checkFormat(stringFormats, format);
const isCurrencyFormat = (format: string): boolean => checkFormat(currencyFormats, format);

const formatDateTime = (value: value, format: string): string => dateTimeFormat(value, format);

const formatCurrency = (value: number, format: string): string => {
  if (format === currencyFormats.USD) {
    return (value / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: currencyFormats.USD,
    });
  }

  return value.toString();
};

const formatString = (value: string, format: string): string => {
  if (format === stringFormats.sentenceCase && value) return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

  return value;
};

const formatters = [
  {
    matches: (value: value, format: string): boolean =>
      format && isDateTimeFormat(format) && (isScalarTime(value) || isValid(parseDateTime(value))),
    format: (value: value, format: string): string => {
      const parsed = isScalarTime(value) ? scalarToDateTime(value) : parseDateTime(value);
      return formatDateTime(parsed, format);
    },
  },
  {
    matches: (value: value, format: string): boolean => format && isStringFormat(format),
    format: formatString,
  },
  {
    matches: (value: value, format: string): boolean => format && isCurrencyFormat(format),
    format: formatCurrency,
  },
];

const formatValue = (value: value, format: string): string => {
  const formatter = formatters.find((f) => f.matches(value, format));
  return formatter ? formatter.format(value, format) : value;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: FALLBACK_LANG,
    debug: env.isDevelopment,
    interpolation: {
      escapeValue: false,
      format: formatValue,
    },
    resources: { en },
  });

export default i18n;
