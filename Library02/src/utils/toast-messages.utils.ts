export enum MessageToasts {
    //CATEGORY
    SUCCESS_CREATE_CATEGORY = "Categoria adicionada com sucesso.",
    SUCCESS_UPDATE_CATEGORY = "Categoria atualizada com sucesso.",
    SUCCESS_DELETE_CATEGORY = "Categoria deletada com sucesso.",
    WARN_DUPLICATE_CATEGORY = "Categoria já existente.",
    INFO_SUCCESS_CANCEL = "Ação cancelada com sucesso.",

    ERROR_GET_ALL_CATEGORIES = "Erro ao carregar as categorias.",
    ERROR_CREATE_CATEGORY = "Erro ao criar a categoria.",
    ERROR_UPDATE_CATEGORY = "Erro ao atualizar a categoria.",
    ERROR_DELETE_CATEGORY = "Erro ao deletar a categoria.",


    //RESERVES
    SUCCESS_CREATE_RESERVE = "A reserva do livro foi criada.",
    SUCCESS_UPDATE_RESERVE = "A reserva foi atualizada.",
    SUCCESS_DELETE_RESERVE = "A reserva foi deletada.",

    ERROR_CREATE_RESERVE = "Houve um erro ao realizar a reserva do livro.",
    ERROR_UPDATE_RESERVE = "Houve um erro ao realizar a atualização da reserva.",
    ERROR_GET_ID_RESERVE = "Houve um erro ao carregar os dados da reserva.",
    ERROR_GET_ALL_RESERVES = "Houve um erro ao carregar as reservas.",
    ERROR_DELETE_RESERVE = "Houve um erro ao deletar a reserva do livro.",

    //RENT
    ERROR_RETURN_RENT = "Não foi possível fazer a devolução.",
    SUCCESS_RETURN_RENT = "Aluguel devolvido com sucesso!",
    ERROR_DELETE_RENT = "Erro ao deletar.",
    SUCCESS_DELETE_RENT = "Deletado com sucesso!",
    SUCCESS_REGISTER_RENT = "Aluguel cadastrado com sucesso!",
    ERROR_REGISTER_RENT = "Erro ao cadastrar.",

    //ERRORS AXIOS
    ERROR_RESPONSE_AXIOS = "Falha na resposta, tente novamente.",
    ERROR_CONECTION_AXIOS = "Falha na conexão, tente novamente.",

    //BOOKS
    SUCCESS_CREATE_BOOK = "Livro cadastrado com sucesso.",
    SUCCESS_UPDATE_BOOK_OLD_DATE = "Livro editado com sucesso.\nSem nova data de publicação.",
    SUCCESS_UPDATE_BOOK_NEW_DATE = "Livro editado com sucesso.\nCom nova data de publicação.",
    SUCCESS_DELETE_BOOK = "Livro deletado com sucesso.",

    ERROR_CREATE_BOOK = "Não foi possível cadastrar o livro.\nPreencha todos os campos corretamente.",
    ERROR_UPDATE_BOOK = "Não foi possível editar o livro.\nPreencha todos os campos corretamente.",
    ERROR_DELETE_BOOK = "Não foi possível deletar o livro.",
    ERROR_GET_BOOK = "Não foi possível recuperar o livro.",
    ERROR_GET_BOOKS = "Não foi possível recuperar os livros.",

    //STOCK
    SUCCESS_CREATE_STOCK = "Estoque criado com sucesso.",
    SUCCESS_UPDATE_STOCK = "Seu estoque foi atualizado com sucesso.",
    SUCCESS_DELETE_STOCK = "Estoque deletado com sucesso.", 

    INFO_UPDATE = 'Quantidade não modificada.',
    INFO_REGISTER = 'Livro já cadastrado no estoque.',
    
    ERROR_INVALID_ISBN_BOOK = 'Isbn inválido.',
    ERROR_REGISTER_BOOK = 'Livro não encontrado.',
    ERROR_REGISTER_STOCK = 'Livro não existe.'
}
