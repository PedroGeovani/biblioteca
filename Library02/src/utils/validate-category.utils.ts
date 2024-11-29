import { helpers, maxLength, minLength, required } from "@vuelidate/validators";

export class CategoryValidation {
    static requiredField = helpers.withMessage(
        'O campo é obrigatório!',
        required
    );
    static minLength = helpers.withMessage(
        'Insira uma categoria válida! (min. 3 caracteres)',
        minLength(3)
    );
    static maxLength = helpers.withMessage(
        'A categoria é muito extensa! (max. 25 caracteres)',
        maxLength(25)
    );
    static validCharacters = helpers.withMessage(
        'A categoria não possui caracteres válidos!',
        (value: string): boolean => {
            const rx = /^[A-Za-zÀ-ÖØ-öø-\s\-\_\(\)\&]+$/g;
            return rx.test(value);
        }
    );
    static notRepeatedCharacters = helpers.withMessage(
        'Categoria inválida! Sequência de caracteres repetidos.',
        (value: string): boolean => {
            const hasUniqueCharacters = new Set(value).size > 1;
            const hasNotRepeatedPatterns = /^(?!.*(?:^(.+)\1+$|(.+)\2+)$).+$/.test(value);
            return hasUniqueCharacters && hasNotRepeatedPatterns;
        }
    );
}
