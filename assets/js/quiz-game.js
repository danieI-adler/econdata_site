// --- Easter Egg: Tech & Data Quiz EconData Analytics (5 Níveis de Dificuldade) ---
// Ativado exclusivamente quando o usuário digita "QUIZ" ou "LEADERBOARD" no Console R
// Mais de 30 questões por nível com sorteio aleatório a cada partida!

(function() {
  const STORAGE_KEY = 'econdata_quiz_leaderboard';

  const QUIZ_QUESTIONS = {
  "1": [
    {
      "q": "Qual é a saída deste pseudocódigo?\n<div class=\"quiz-code-block\">x = 5\ny = 3\nx = x + y\ny = x - y\nx = x - y\nimprimir(x, y)</div>",
      "options": [
        "5, 3",
        "3, 5",
        "8, 2",
        "3, 3"
      ],
      "answer": 1,
      "explanation": "Esse é o clássico algoritmo de troca de duas variáveis sem variável auxiliar (swap). x passa a valer 3 e y passa a valer 5."
    },
    {
      "q": "Qual será o valor final de 'soma'?\n<div class=\"quiz-code-block\">soma = 0\npara i de 1 até 4 faça:\n  soma = soma + i\nimprimir(soma)</div>",
      "options": [
        "4",
        "6",
        "10",
        "15"
      ],
      "answer": 2,
      "explanation": "A soma acumulada é: 1 + 2 + 3 + 4 = 10."
    },
    {
      "q": "Em linguagens de programação, qual é o tipo de dado utilizado para representar valores Verdadeiro ou Falso?",
      "options": [
        "String",
        "Boolean",
        "Float",
        "Array"
      ],
      "answer": 1,
      "explanation": "Boolean (ou booleano) representa valores lógicos binários (True / False)."
    },
    {
      "q": "Qual será o valor de 'resultado'?\n<div class=\"quiz-code-block\">resultado = 17 % 5</div>",
      "options": [
        "3.4",
        "3",
        "2",
        "1"
      ],
      "answer": 2,
      "explanation": "O operador '%' calcula o resto da divisão inteira: 17 = 3 * 5 + 2, logo o resto é 2."
    },
    {
      "q": "Quantas vezes a mensagem 'Olá' será impressa?\n<div class=\"quiz-code-block\">contador = 0\nenquanto contador < 3 faça:\n  imprimir('Olá')\n  contador = contador + 1</div>",
      "options": [
        "2 vezes",
        "3 vezes",
        "4 vezes",
        "Infinitas vezes"
      ],
      "answer": 1,
      "explanation": "O loop executa para contador = 0, 1 e 2. Quando chega a 3, a condição falha e o loop termina (3 vezes)."
    },
    {
      "q": "Qual o valor impresso neste pseudocódigo?\n<div class=\"quiz-code-block\">a = 10\nse (a > 5 e a < 8) então:\n  imprimir('A')\nsenão se (a >= 10 ou a == 5) então:\n  imprimir('B')\nsenão:\n  imprimir('C')</div>",
      "options": [
        "A",
        "B",
        "C",
        "Nenhum"
      ],
      "answer": 1,
      "explanation": "A primeira condição é falsa (10 não é menor que 8). A segunda é verdadeira porque (a >= 10) é satisfeito, imprimindo 'B'."
    },
    {
      "q": "Na maioria das linguagens modernas (C, Python, Java, JS), qual é o índice do primeiro elemento de uma lista/array?",
      "options": [
        "0",
        "1",
        "-1",
        "null"
      ],
      "answer": 0,
      "explanation": "Essas linguagens usam indexação baseada em zero (0-indexed)."
    },
    {
      "q": "Qual o valor de 'res' após a execução?\n<div class=\"quiz-code-block\">função misterio(n):\n  se n <= 1 então retorne 1\n  retorne n * misterio(n - 1)\n\nres = misterio(4)</div>",
      "options": [
        "10",
        "16",
        "24",
        "120"
      ],
      "answer": 2,
      "explanation": "Esta função calcula o fatorial de n. Para n = 4: 4 * 3 * 2 * 1 = 24."
    },
    {
      "q": "Qual estrutura de repetição é indicada quando NÃO se sabe previamente quantas iterações serão necessárias?",
      "options": [
        "for",
        "while (enquanto)",
        "switch",
        "const"
      ],
      "answer": 1,
      "explanation": "O laço 'while' é ideal quando a condição de parada depende de um evento ou cálculo dinâmico."
    },
    {
      "q": "O que a instrução 'return' faz dentro de uma função?",
      "options": [
        "Interrompe o computador",
        "Encerra a função e devolve um valor ao chamador",
        "Reinicia o loop principal",
        "Imprime o texto na tela"
      ],
      "answer": 1,
      "explanation": "Return finaliza a execução da função corrente e envia o resultado especificado de volta."
    },
    {
      "q": "Qual é a saída deste trecho?\n<div class=\"quiz-code-block\">lista = [10, 20, 30, 40]\nimprimir(lista[2])</div>",
      "options": [
        "10",
        "20",
        "30",
        "40"
      ],
      "answer": 2,
      "explanation": "Em listas baseadas em zero: índice 0 é 10, índice 1 é 20, e índice 2 é 30."
    },
    {
      "q": "Qual será o valor de 'count'?\n<div class=\"quiz-code-block\">count = 0\npara i de 1 até 3 faça:\n  para j de 1 até 2 faça:\n    count = count + 1\nimprimir(count)</div>",
      "options": [
        "5",
        "6",
        "9",
        "3"
      ],
      "answer": 1,
      "explanation": "São 3 iterações do loop externo, e para cada uma há 2 iterações do interno: 3 * 2 = 6."
    },
    {
      "q": "Em lógica booleana, qual é o resultado de: NOT (VERDADEIRO OR FALSO)?",
      "options": [
        "Verdadeiro",
        "Falso",
        "Nulo",
        "Erro de Sintaxe"
      ],
      "answer": 1,
      "explanation": "VERDADEIRO OR FALSO é VERDADEIRO. Negando com NOT, temos FALSO."
    },
    {
      "q": "Qual é o objetivo primordial de um algoritmo?",
      "options": [
        "Criar interfaces visuais com CSS",
        "Descrever uma sequência finita e bem definida de instruções para resolver um problema",
        "Conectar cabos de rede à placa-mãe",
        "Substituir o processador do computador"
      ],
      "answer": 1,
      "explanation": "Um algoritmo é uma sequência não ambígua de passos finitos que transforma entradas em saídas desejadas."
    },
    {
      "q": "Qual das seguintes atribuições de variável é válida na maioria das linguagens?",
      "options": [
        "2x = 10",
        "valor-total = 10",
        "total_vendas = 10",
        "total vendas = 10"
      ],
      "answer": 2,
      "explanation": "Identificadores de variáveis não podem iniciar com dígitos, nem conter espaços ou hífen (que é operador de subtração)."
    },
    {
      "q": "Qual será o valor final de 'b'?\n<div class=\"quiz-code-block\">a = 15\nb = 4\nse a % b == 0 então:\n  b = b * 2\nsenão:\n  b = a / b (divisão inteira)\nimprimir(b)</div>",
      "options": [
        "8",
        "3",
        "3.75",
        "4"
      ],
      "answer": 1,
      "explanation": "15 % 4 é 3 (não é 0). Logo, cai no senão: 15 / 4 divisão inteira resulta em 3."
    },
    {
      "q": "O que acontece se uma condição de parada de um loop 'enquanto' nunca for satisfeita?",
      "options": [
        "O programa executa mais rápido",
        "Ocorre um Loop Infinito (o programa trava ou não termina)",
        "A variável vira nula automaticamente",
        "O sistema converte para um loop for"
      ],
      "answer": 1,
      "explanation": "Sem condição de terminação válida, o laço roda indefinidamente consumindo CPU (loop infinito)."
    },
    {
      "q": "Qual é a função do operador de atribuição '=' em oposição ao comparador '=='?",
      "options": [
        "'=' atribui um valor à variável; '==' compara se dois valores são iguais",
        "'==' atribui valor; '=' compara igualdade",
        "Ambos são exatamente idênticos",
        "'=' só funciona com números; '==' com textos"
      ],
      "answer": 0,
      "explanation": "'=' é atribuição (armazenamento na memória), enquanto '==' é o operador relacional de comparação de igualdade."
    },
    {
      "q": "Qual é a saída deste código?\n<div class=\"quiz-code-block\">nomes = ['Ana', 'Bia', 'Caio']\nimprimir(tamanho(nomes))</div>",
      "options": [
        "2",
        "3",
        "4",
        "Caio"
      ],
      "answer": 1,
      "explanation": "A lista contém 3 elementos ('Ana', 'Bia', 'Caio'). O comprimento (length/len) é 3."
    },
    {
      "q": "Qual será a saída?\n<div class=\"quiz-code-block\">x = 10\nse x > 10 então:\n  imprimir('Maior')\nsenão se x < 10 então:\n  imprimir('Menor')\nsenão:\n  imprimir('Igual')</div>",
      "options": [
        "Maior",
        "Menor",
        "Igual",
        "Maior e Igual"
      ],
      "answer": 2,
      "explanation": "Como x é exatamente 10, nem x > 10 nem x < 10 são atendidos. O fluxo vai para o 'senão', imprimindo 'Igual'."
    },
    {
      "q": "O que significa 'concatenar' duas strings em programação?",
      "options": [
        "Multiplicar seus comprimentos",
        "Unir duas cadeias de caracteres em uma única sequência",
        "Converter texto em número decimal",
        "Inverter a ordem das letras"
      ],
      "answer": 1,
      "explanation": "Concatenar é a operação de junção de strings (ex: 'Eco' + 'nData' = 'EconData')."
    },
    {
      "q": "Qual será o valor de 'y'?\n<div class=\"quiz-code-block\">x = 2\ny = (x + 3) * 4 - x</div>",
      "options": [
        "18",
        "20",
        "12",
        "14"
      ],
      "answer": 0,
      "explanation": "(2 + 3) = 5 -> 5 * 4 = 20 -> 20 - 2 = 18. Precedência de parênteses e operadores."
    },
    {
      "q": "O que é um 'bug' no contexto do desenvolvimento de software?",
      "options": [
        "Um vírus de computador altamente infeccioso",
        "Um erro, falha ou comportamento inesperado no código de um programa",
        "Um tipo de monitor de alta resolução",
        "Uma peça física quebrada na placa-mãe"
      ],
      "answer": 1,
      "explanation": "Bug é o termo universal para falhas lógicas ou de implementação em software."
    },
    {
      "q": "Qual a principal vantagem de modularizar código em funções?",
      "options": [
        "Deixar o código mais pesado propositalmente",
        "Reutilização de código, facilidade de manutenção e redução de duplicação",
        "Evitar o uso de variáveis",
        "Garantir que o código nunca seja testado"
      ],
      "answer": 1,
      "explanation": "Funções permitem isolar responsabilidades (DRY: Don't Repeat Yourself) e facilitam testes unitários."
    },
    {
      "q": "Qual o valor impresso?\n<div class=\"quiz-code-block\">vetor = [5, 2, 9, 1]\nmenor = vetor[0]\npara cada num em vetor:\n  se num < menor então:\n    menor = num\nimprimir(menor)</div>",
      "options": [
        "5",
        "9",
        "1",
        "2"
      ],
      "answer": 2,
      "explanation": "O algoritmo percorre o array encontrando o menor elemento, que é 1."
    },
    {
      "q": "Qual das seguintes estruturas armazena pares de 'chave-valor'?",
      "options": [
        "Dicionário (ou Hash Map)",
        "Fila simples",
        "Array de inteiros",
        "Pilha"
      ],
      "answer": 0,
      "explanation": "Dicionários / Maps associam chaves únicas a valores correspondentes."
    },
    {
      "q": "Qual o resultado de 'x' neste trecho?\n<div class=\"quiz-code-block\">x = 1\npara i de 1 até 3 faça:\n  x = x * 2\nimprimir(x)</div>",
      "options": [
        "6",
        "8",
        "4",
        "16"
      ],
      "answer": 1,
      "explanation": "x dobra a cada passo: 1 -> 2 -> 4 -> 8 (2 elevado ao cubo)."
    },
    {
      "q": "Em pseudocódigo, o que o comando 'ler(idade)' costuma representar?",
      "options": [
        "Captura um dado fornecido pelo usuário via entrada padrão (teclado)",
        "Exibe o valor de idade na tela",
        "Calcula a raiz quadrada da idade",
        "Deleta a variável da memória"
      ],
      "answer": 0,
      "explanation": "'Ler' representa a leitura da entrada (input)."
    },
    {
      "q": "Qual é a saída deste código?\n<div class=\"quiz-code-block\">msg = 'Puc-Rio'\nimprimir(para_maiusculo(msg))</div>",
      "options": [
        "puc-rio",
        "PUC-RIO",
        "Puc-Rio",
        "PUC_RIO"
      ],
      "answer": 1,
      "explanation": "Funções de maiúsculo (uppercase / toupper) transformam todos os caracteres alfabéticos em letras maiúsculas."
    },
    {
      "q": "Qual será a saída deste pseudocódigo?\n<div class=\"quiz-code-block\">a = [1, 2, 3]\ninverter(a)\nimprimir(a[0])</div>",
      "options": [
        "1",
        "2",
        "3",
        "null"
      ],
      "answer": 2,
      "explanation": "Ao inverter a lista [1, 2, 3], ela passa a ser [3, 2, 1]. O índice 0 agora é 3."
    },
    {
      "q": "Qual é o valor de 'resp'?\n<div class=\"quiz-code-block\">resp = (10 >= 10) e (5 != 5)</div>",
      "options": [
        "Verdadeiro",
        "Falso",
        "Nulo",
        "Erro"
      ],
      "answer": 1,
      "explanation": "(10 >= 10) é Verdadeiro, mas (5 != 5) é Falso. Na conjunção 'E', Verdadeiro E Falso resulta em Falso."
    }
  ],
  "2": [
    {
      "q": "Em Python, qual é a principal diferença entre uma lista e uma tupla?",
      "options": [
        "Listas são imutáveis; tuplas são mutáveis",
        "Tuplas são imutáveis; listas são mutáveis",
        "Tuplas só aceitam números",
        "Listas não suportam iteração"
      ],
      "answer": 1,
      "explanation": "Tuplas são imutáveis (seus elementos não podem ser alterados após criação), enquanto listas são mutáveis."
    },
    {
      "q": "No ecossistema R (Tidyverse), qual operador ('pipe') é tradicionalmente usado para encadear funções no dplyr?",
      "options": [
        "->>",
        "%>%",
        "::",
        "$$"
      ],
      "answer": 1,
      "explanation": "O operador pipe '%>%' (do pacote magrittr/dplyr) passa o resultado da esquerda como primeiro argumento da direita."
    },
    {
      "q": "Qual é a saída do seguinte código Python?\n<div class=\"quiz-code-block\">x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))</div>",
      "options": [
        "3",
        "4",
        "Erro de atribuição",
        "None"
      ],
      "answer": 1,
      "explanation": "Em Python, listas são objetos passados por referência. Modificar y altera a mesma lista apontada por x."
    },
    {
      "q": "Qual é o valor de retorno da expressão JavaScript: typeof NaN?",
      "options": [
        "'undefined'",
        "'number'",
        "'NaN'",
        "'null'"
      ],
      "answer": 1,
      "explanation": "Em JavaScript e no padrão IEEE 754, NaN significa 'Not a Number', mas seu tipo primitivo ainda é 'number'."
    },
    {
      "q": "Em R, ao contrário de Python e C, a indexação padrão de vetores começa em qual número?",
      "options": [
        "0",
        "1",
        "-1",
        "Depende do pacote"
      ],
      "answer": 1,
      "explanation": "O R segue a convenção matemática matricial onde o primeiro elemento está na posição 1."
    },
    {
      "q": "Qual estrutura de dados opera no princípio LIFO (Last In, First Out)?",
      "options": [
        "Fila (Queue)",
        "Pilha (Stack)",
        "Tabela Hash",
        "Grafo"
      ],
      "answer": 1,
      "explanation": "Uma Pilha (Stack) insere e remove do mesmo topo: o último a entrar é o primeiro a sair."
    },
    {
      "q": "Qual é a saída deste código Python?\n<div class=\"quiz-code-block\">nums = [i * 2 for i in range(4) if i % 2 == 0]\nprint(nums)</div>",
      "options": [
        "[0, 2, 4, 6]",
        "[0, 4]",
        "[2, 6]",
        "[0, 2]"
      ],
      "answer": 1,
      "explanation": "range(4) tem 0, 1, 2, 3. Os pares são 0 e 2. Multiplicados por 2 resultam em [0, 4]."
    },
    {
      "q": "No R, o que faz a função c() em 'vetor <- c(1, 4, 9)'?",
      "options": [
        "Calcula a correlação",
        "Combina/concatena elementos em um vetor atômico",
        "Cria uma classe orientada a objetos",
        "Limpa a memória do R"
      ],
      "answer": 1,
      "explanation": "A função c() vem de 'combine' e é a primitiva basilar do R para criar vetores."
    },
    {
      "q": "Qual erro ocorre ao executar o seguinte código Python?\n<div class=\"quiz-code-block\">d = {'a': 1, 'b': 2}\nprint(d['c'])</div>",
      "options": [
        "IndexError",
        "KeyError",
        "ValueError",
        "TypeError"
      ],
      "answer": 1,
      "explanation": "Acessar diretamente uma chave inexistente em um dicionário Python lança um KeyError. Para evitar isso usa-se d.get('c')."
    },
    {
      "q": "O que imprime o seguinte código R?\n<div class=\"quiz-code-block\">x <- c(TRUE, FALSE, TRUE)\nsum(x)</div>",
      "options": [
        "Erro de tipo",
        "2",
        "3",
        "TRUE"
      ],
      "answer": 1,
      "explanation": "No R, booleanos sofrem coerção automática para inteiros em operações aritméticas: TRUE vira 1 e FALSE vira 0 (1 + 0 + 1 = 2)."
    },
    {
      "q": "Qual é a saída deste código JavaScript?\n<div class=\"quiz-code-block\">console.log(1 + '2' + 3);</div>",
      "options": [
        "6",
        "'123'",
        "'15'",
        "NaN"
      ],
      "answer": 1,
      "explanation": "1 + '2' sofre coerção para string ('12'). Em seguida, '12' + 3 resulta na string '123'."
    },
    {
      "q": "No Pandas (Python), qual método é utilizado para remover valores duplicados de um DataFrame?",
      "options": [
        "df.clean()",
        "df.drop_duplicates()",
        "df.unique()",
        "df.filter_duplicates()"
      ],
      "answer": 1,
      "explanation": "drop_duplicates() elimina linhas duplicadas preservando a primeira ocorrência por padrão."
    },
    {
      "q": "O que o seguinte código R retorna?\n<div class=\"quiz-code-block\">x <- c(10, 20, 30, 40)\nx[-2]</div>",
      "options": [
        "30",
        "c(10, 30, 40)",
        "-20",
        "Erro: índice negativo não suportado"
      ],
      "answer": 1,
      "explanation": "No R, índices negativos excluem o elemento naquela posição. x[-2] retorna todos exceto o 2º elemento."
    },
    {
      "q": "Qual é a saída deste código Python?\n<div class=\"quiz-code-block\">s = 'EconData'\nprint(s[1:4])</div>",
      "options": [
        "'Eco'",
        "'con'",
        "'Econ'",
        "'cond'"
      ],
      "answer": 1,
      "explanation": "Slicing em Python pega do índice 1 (inclusive) ao 4 (exclusive): índices 1 ('c'), 2 ('o'), 3 ('n') -> 'con'."
    },
    {
      "q": "No dplyr do R, qual verbo é usado para filtrar linhas com base em condições lógicas?",
      "options": [
        "select()",
        "mutate()",
        "filter()",
        "arrange()"
      ],
      "answer": 2,
      "explanation": "filter() seleciona linhas com base em critérios; select() seleciona colunas."
    },
    {
      "q": "Em Python, o que 'is' verifica em comparação com '=='?",
      "options": [
        "'is' verifica identidade de objeto na memória (id); '==' verifica igualdade de valor",
        "'is' é usado apenas para strings; '==' para inteiros",
        "Ambos fazem exatamente a mesma comparação em tempo de execução",
        "'is' converte os tipos antes de comparar"
      ],
      "answer": 0,
      "explanation": "x is y checa se x e y apontam para o mesmo endereço de memória. x == y checa se os valores são equivalentes."
    },
    {
      "q": "Qual é a complexidade de tempo para buscar um item pelo índice em uma Lista/Array em memória contígua?",
      "options": [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n^2)"
      ],
      "answer": 0,
      "explanation": "Acesso direto por índice via aritmética de ponteiros base + (índice * tamanho) tem custo constante O(1)."
    },
    {
      "q": "Qual a saída deste código em Python?\n<div class=\"quiz-code-block\">print(bool([]), bool([0]))</div>",
      "options": [
        "True True",
        "False False",
        "False True",
        "True False"
      ],
      "answer": 2,
      "explanation": "Lista vazia [] tem valor 'falsy' em Python. Uma lista contendo elementos (mesmo contendo 0) é não vazia, logo 'truthy'."
    },
    {
      "q": "No ggplot2 do R, qual operador é usado para adicionar camadas e geometrias a um gráfico?",
      "options": [
        "%>%",
        "+",
        "|",
        ">>"
      ],
      "answer": 1,
      "explanation": "O ggplot2 utiliza o operador de sobreposição de camadas '+' (ex: ggplot(...) + geom_line() + theme_minimal())."
    },
    {
      "q": "Qual das seguintes estruturas de dados NÃO permite elementos duplicados?",
      "options": [
        "List (Lista)",
        "Set (Conjunto)",
        "Tuple (Tupla)",
        "Deque"
      ],
      "answer": 1,
      "explanation": "Sets (conjuntos) impõem unicidade estrita aos seus elementos através de funções de dispersão (hash)."
    },
    {
      "q": "Qual é a saída deste código Python?\n<div class=\"quiz-code-block\">a = (1,)\nprint(type(a))</div>",
      "options": [
        "<class 'int'>",
        "<class 'tuple'>",
        "<class 'list'>",
        "<class 'generator'>"
      ],
      "answer": 1,
      "explanation": "A vírgula (1,) define a tupla de 1 elemento. Sem a vírgula, (1) seria apenas um inteiro entre parênteses."
    },
    {
      "q": "No R, qual é a representação padrão para dados ausentes (missing values)?",
      "options": [
        "NULL",
        "NaN",
        "NA",
        "undefined"
      ],
      "answer": 2,
      "explanation": "No R, NA (Not Available) é o tipo especial que representa ausência de observação em vetores e dataframes."
    },
    {
      "q": "Qual é a saída deste trecho em Python?\n<div class=\"quiz-code-block\">def foo(x=[]):\n  x.append(1)\n  return x\n\nfoo()\nprint(foo())</div>",
      "options": [
        "[1]",
        "[1, 1]",
        "Erro: mutable argument",
        "None"
      ],
      "answer": 1,
      "explanation": "Em Python, argumentos com valor padrão mutável são avaliados apenas uma vez na definição da função. A lista persiste entre chamadas."
    },
    {
      "q": "Qual método em Python converte uma string JSON para um dicionário nativo?",
      "options": [
        "json.dump()",
        "json.loads()",
        "json.encode()",
        "json.parse()"
      ],
      "answer": 1,
      "explanation": "json.loads() lê uma string JSON ('load string') e desserializa em estruturas nativas do Python."
    },
    {
      "q": "No R, o que a função sapply(1:3, function(x) x^2) retorna?",
      "options": [
        "Uma lista",
        "Um vetor numérico c(1, 4, 9)",
        "Um dataframe de 3 linhas",
        "Um erro de sintaxe"
      ],
      "answer": 1,
      "explanation": "sapply simplifica ('simplifying apply') a saída para o formato mais compacto possível, retornando um vetor."
    },
    {
      "q": "O que a instrução 'break' faz quando executada dentro de um laço for em Python ou R?",
      "options": [
        "Pula imediatamente para a próxima iteração",
        "Interrompe e encerra o laço prematuramente",
        "Lança uma exceção",
        "Reinicia a contagem de i"
      ],
      "answer": 1,
      "explanation": "'break' encerra a execução do laço mais interno imediatamente. 'continue' (ou 'next' em R) pula para o próximo passo."
    },
    {
      "q": "No Pandas, qual é o resultado de df['idade'].isna().sum()?",
      "options": [
        "A média de idades",
        "A contagem total de valores ausentes (NaN) na coluna idade",
        "A remoção das linhas nulas",
        "Retorna True ou False"
      ],
      "answer": 1,
      "explanation": "isna() gera booleanos onde há valores ausentes, e sum() soma os True (1), totalizando a quantidade de nulos."
    },
    {
      "q": "Qual é a saída deste código JavaScript?\n<div class=\"quiz-code-block\">console.log([] == ![]);</div>",
      "options": [
        "true",
        "false",
        "TypeError",
        "undefined"
      ],
      "answer": 0,
      "explanation": "![] vira false. Em seguida, [] == false converte ambos para números (0 == 0), resultando bizarramente em true."
    },
    {
      "q": "Qual o resultado de 2 ** 3 ** 2 em Python (associatividade de exponenciação)?",
      "options": [
        "64",
        "512",
        "36",
        "128"
      ],
      "answer": 1,
      "explanation": "O operador ** tem associatividade à direita: primeiro 3 ** 2 = 9, depois 2 ** 9 = 512."
    },
    {
      "q": "No dplyr, qual função é usada para criar ou transformar colunas em uma tabela?",
      "options": [
        "filter()",
        "mutate()",
        "summarise()",
        "relocate()"
      ],
      "answer": 1,
      "explanation": "mutate() é a função para derivar novas variáveis a partir das colunas existentes."
    }
  ],
  "3": [
    {
      "q": "Em SQL, qual cláusula deve ser utilizada para filtrar grupos agregados após um GROUP BY?",
      "options": [
        "WHERE",
        "HAVING",
        "ORDER BY",
        "FILTER"
      ],
      "answer": 1,
      "explanation": "WHERE filtra linhas individuais antes do agrupamento; HAVING filtra os grupos após a agregação."
    },
    {
      "q": "Qual é a complexidade assintótica média de busca, inserção e remoção em uma Tabela Hash bem dimensionada?",
      "options": [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n log n)"
      ],
      "answer": 0,
      "explanation": "Tabelas Hash com boa função de hashing possuem tempo médio constante O(1)."
    },
    {
      "q": "O que esta query SQL retorna se houver clientes sem pedidos?\n<div class=\"quiz-code-block\">SELECT c.nome, p.id \nFROM clientes c \nLEFT JOIN pedidos p ON c.id = p.cliente_id;</div>",
      "options": [
        "Apenas os clientes que possuem pedidos",
        "Todos os clientes, com p.id NULL para os que não têm pedidos",
        "Ocorre um erro de chave estrangeira",
        "Apenas os clientes que NÃO possuem pedidos"
      ],
      "answer": 1,
      "explanation": "LEFT JOIN preserva todas as linhas da tabela à esquerda (clientes), preenchendo as colunas de pedidos com NULL quando não há correspondência."
    },
    {
      "q": "No Git, o que o comando 'git rebase' faz em comparação com 'git merge'?",
      "options": [
        "Deleta os commits antigos sem aviso",
        "Reaplica commits em cima de outra ponta base, criando um histórico linear",
        "Apenas baixa as alterações remotas sem alterar o grafo local",
        "Cria sempre um commit com dois pais"
      ],
      "answer": 1,
      "explanation": "Rebase reaplica os commits da branch atual sobre o topo da branch alvo, mantendo o histórico limpo e linear."
    },
    {
      "q": "O que é 'data leakage' (vazamento de dados) em pipelines de Machine Learning?",
      "options": [
        "Quando um hacker invade a base de dados do modelo",
        "Quando informações do conjunto de teste ou do futuro são inadvertidamente usadas no treinamento",
        "Quando o dataset possui muitos valores ausentes (NaN)",
        "Quando o modelo atinge 100% de recall artificialmente"
      ],
      "answer": 1,
      "explanation": "Data leakage ocorre quando variáveis que não estariam disponíveis no momento da predição real contaminam o treino."
    },
    {
      "q": "Qual é a complexidade no pior caso do algoritmo QuickSort quando a escolha do pivô é inadequada?",
      "options": [
        "O(n log n)",
        "O(n^2)",
        "O(n)",
        "O(log n)"
      ],
      "answer": 1,
      "explanation": "Se o pivô for sistematicamente o maior ou menor elemento em um array já ordenado, a recursão não divide o array pela metade, degradando para O(n^2)."
    },
    {
      "q": "Em bancos de dados relacionais, o que significa a sigla ACID?",
      "options": [
        "Atomicity, Consistency, Isolation, Durability",
        "Access, Control, Index, Data",
        "Async, Cache, Integrity, Dispatch",
        "Aggregate, Columnar, Inline, Distributed"
      ],
      "answer": 0,
      "explanation": "ACID é o conjunto de propriedades que garantem que transações de banco de dados sejam processadas com confiabilidade."
    },
    {
      "q": "Qual é o problema deste código em Python ao iterar sobre uma lista?\n<div class=\"quiz-code-block\">itens = [1, 2, 3, 4, 5]\nfor x in itens:\n  if x % 2 == 0:\n    itens.remove(x)</div>",
      "options": [
        "Nenhum, ele remove todos os números pares perfeitamente",
        "Modificar a lista durante a iteração altera os índices internos e pula elementos",
        "Lança um SyntaxError imediato",
        "Converte os itens para strings"
      ],
      "answer": 1,
      "explanation": "Remover elementos de uma coleção enquanto itera diretamente sobre ela altera os ponteiros internos do iterador, pulando o elemento seguinte."
    },
    {
      "q": "Em SQL, qual função de janela (Window Function) atribui um número sequencial único para cada linha dentro de uma partição?",
      "options": [
        "RANK()",
        "DENSE_RANK()",
        "ROW_NUMBER()",
        "COUNT()"
      ],
      "answer": 2,
      "explanation": "ROW_NUMBER() gera números sequenciais únicos (1, 2, 3...) mesmo em caso de empates, enquanto RANK() gera repetições e gaps."
    },
    {
      "q": "Qual estrutura de dados é fundamental para a implementação da Busca em Largura (BFS) em grafos?",
      "options": [
        "Pilha (Stack)",
        "Fila (Queue)",
        "Heap Máxima",
        "Árvore Binária de Busca"
      ],
      "answer": 1,
      "explanation": "A BFS explora vértices nível a nível, necessitando de uma estrutura FIFO (Fila) para gerenciar os nós a visitar."
    },
    {
      "q": "O que faz uma junção do tipo CROSS JOIN em SQL?",
      "options": [
        "Junta tabelas apenas se houver chave primária idêntica",
        "Calcula o Produto Cartesiano de ambas as tabelas (todas as combinações possíveis)",
        "Exclui duplicatas entre as duas tabelas",
        "Faz um unpivot das colunas em linhas"
      ],
      "answer": 1,
      "explanation": "CROSS JOIN combina cada linha da tabela A com todas as linhas da tabela B (se A tem n linhas e B tem m, o resultado tem n * m linhas)."
    },
    {
      "q": "Em Python, o que são *args e **kwargs na assinatura de uma função?",
      "options": [
        "Tipos de ponteiros em C",
        "*args captura argumentos posicionais arbitrários em uma tupla; **kwargs captura argumentos nomeados em um dicionário",
        "Variáveis globais obrigatórias",
        "Decoradores de classe assíncrona"
      ],
      "answer": 1,
      "explanation": "*args empacota argumentos posicionais em tupla e **kwargs empacota argumentos com chave (keyword arguments) em dict."
    },
    {
      "q": "Qual é a principal desvantagem de usar um índice em uma tabela de banco de dados com alto volume de escritas (INSERT/UPDATE)?",
      "options": [
        "Torna as consultas SELECT mais lentas",
        "Aumenta o tempo das operações de escrita, pois cada INSERT requer a atualização da estrutura B-Tree do índice",
        "Apaga os logs de transação",
        "Invalida as chaves primárias"
      ],
      "answer": 1,
      "explanation": "Índices aceleram leituras, mas penalizam escritas porque o motor de banco precisa recalibrar as árvores de índices a cada inserção/atualização."
    },
    {
      "q": "O que este decorador faz em Python?\n<div class=\"quiz-code-block\">from functools import lru_cache\n\n@lru_cache(maxsize=128)\ndef fib(n):\n  ...</div>",
      "options": [
        "Executa a função em segundo plano com threads",
        "Armazena em cache (memoization) os resultados de chamadas recentes com os mesmos parâmetros",
        "Converte o retorno da função para JSON",
        "Limita a memória RAM do computador a 128 MB"
      ],
      "answer": 1,
      "explanation": "lru_cache implementa memoização Least Recently Used, eliminando recálculos idênticos e acelerando algoritmos recursivos."
    },
    {
      "q": "Qual a diferença entre UNION e UNION ALL em SQL?",
      "options": [
        "UNION elimina linhas duplicadas (faz deduplicação implícita); UNION ALL preserva todas as linhas sem checagem",
        "UNION ALL é mais lento que UNION",
        "UNION só aceita duas tabelas; UNION ALL aceita infinitas",
        "Não há diferença em bancos modernos"
      ],
      "answer": 0,
      "explanation": "UNION requer uma operação interna de ordenação/hash para remover duplicatas; UNION ALL simplesmente anexa os resultados e é muito mais rápido."
    },
    {
      "q": "O que a métrica ROC-AUC mede em modelos de classificação binária?",
      "options": [
        "A acurácia do modelo em dados balanceados",
        "A capacidade do modelo de discriminar entre classes positivas e negativas em todos os limiares de decisão possíveis",
        "O tempo de inferência do algoritmo em milissegundos",
        "O erro médio quadrático dos resíduos"
      ],
      "answer": 1,
      "explanation": "A área sob a curva ROC (AUC) mede a probabilidade de um exemplo positivo aleatório ser classificado com escore maior que um negativo."
    },
    {
      "q": "O que acontece com uma variável definida com 'let' vs 'var' dentro de um bloco 'if' em JavaScript?",
      "options": [
        "'let' tem escopo de bloco (block-scoped); 'var' tem escopo de função (function-scoped)",
        "'var' não pode ser reatribuída",
        "'let' vaza para o escopo global automaticamente",
        "São 100% intercambiáveis desde o ES6"
      ],
      "answer": 0,
      "explanation": "'let' e 'const' respeitam escopo de bloco ({ }), evitando vazamentos de variáveis que ocorriam com o 'var'."
    },
    {
      "q": "Em R, qual é a principal vantagem do pacote 'data.table' em relação ao 'data.frame' nativo?",
      "options": [
        "Gera gráficos automáticos sem ggplot2",
        "Sintaxe compacta [i, j, by], passagem por referência (modificação in-place :=) e velocidade brutal em grandes volumes de dados",
        "Funciona sem alocação de memória RAM",
        "Converte código R em Python"
      ],
      "answer": 1,
      "explanation": "data.table faz modificação por referência e utiliza algoritmos de radix sort e paralelismo em C para máxima performance."
    },
    {
      "q": "Qual é a saída deste código Python?\n<div class=\"quiz-code-block\">a = [1, 2, 3]\nb = a[:]\nb.append(4)\nprint(a)</div>",
      "options": [
        "[1, 2, 3, 4]",
        "[1, 2, 3]",
        "Erro de sintaxe",
        "None"
      ],
      "answer": 1,
      "explanation": "a[:] cria uma cópia rasa (shallow copy) da lista. Alterar 'b' não afeta 'a'."
    },
    {
      "q": "O que é um 'deadlock' em bancos de dados relacionais?",
      "options": [
        "Quando o disco rígido atinge 100% de capacidade",
        "Quando duas transações concorrentes bloqueiam recursos que a outra necessita, ficando travadas esperando mutuamente",
        "Quando uma tabela perde sua chave primária",
        "Quando a conexão de rede cai"
      ],
      "answer": 1,
      "explanation": "Deadlock é uma dependência cíclica de locks entre duas transações concorrentes."
    },
    {
      "q": "Em algoritmos de busca, qual é a complexidade da Busca Binária (Binary Search) em um array previamente ordenado?",
      "options": [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n log n)"
      ],
      "answer": 1,
      "explanation": "A cada passo, o espaço de busca é reduzido pela metade, resultando em complexidade logarítmica O(log n)."
    },
    {
      "q": "O que significa 'overfitting' em modelos de Machine Learning?",
      "options": [
        "O modelo aprende perfeitamente o ruído e particularidades dos dados de treino, mas generaliza mal para dados novos",
        "O modelo é simples demais e não captura nem os padrões básicos",
        "O modelo demora muito para compilar",
        "Quando o dataset possui colunas demais para o pandas"
      ],
      "answer": 0,
      "explanation": "Overfitting é o sobreajuste: alta acurácia no treino e péssima performance nos testes e em produção."
    },
    {
      "q": "Em SQL, o que a cláusula COALESCE(coluna, 0) faz?",
      "options": [
        "Retorna o primeiro valor não nulo na lista de argumentos",
        "Apaga todas as linhas com valor 0",
        "Arredonda os números decimais para zero casas",
        "Converte textos para números inteiros"
      ],
      "answer": 0,
      "explanation": "COALESCE retorna o primeiro argumento não-NULL encontrado, sendo ideal para definir valores padrão (fallbacks)."
    },
    {
      "q": "Qual a função da palavra-chave 'yield' em Python?",
      "options": [
        "Interrompe o script com erro",
        "Transforma a função em um gerador (generator), produzindo valores sob demanda sem alocar tudo na memória",
        "Exporta variáveis para arquivos CSV",
        "Define uma constante imutável"
      ],
      "answer": 1,
      "explanation": "'yield' pausa a execução da função e devolve o valor ao iterador, preservando o estado para a próxima chamada (lazy evaluation)."
    },
    {
      "q": "Em Git, o que o comando 'git cherry-pick <commit_hash>' faz?",
      "options": [
        "Apaga o commit selecionado",
        "Aplica as alterações introduzidas por um commit específico de outra branch na branch atual",
        "Cria uma nova tag de versão de release",
        "Compara duas branches e gera um arquivo zip"
      ],
      "answer": 1,
      "explanation": "Cherry-pick permite 'pinçar' um único commit pontual de qualquer ramificação e aplicá-lo no HEAD atual."
    },
    {
      "q": "Qual é a principal diferença entre uma Árvore Binária simples e uma Árvore AVL / Rubro-Negra?",
      "options": [
        "Árvores AVL/Rubro-Negras são auto-balanceadas, garantindo altura O(log n) e prevenindo degradação para O(n)",
        "Árvores simples só armazenam texto",
        "Árvores balanceadas consomem menos ciclos de CPU na inserção",
        "Árvores simples não possuem nós filhos"
      ],
      "answer": 0,
      "explanation": "Árvores balanceadas usam rotações automáticas para garantir que a profundidade permaneça proporcional a log(n)."
    },
    {
      "q": "No ecossistema Python, para que serve um ambiente virtual (venv / virtualenv)?",
      "options": [
        "Para rodar o Windows dentro do Linux",
        "Isolar dependências e versões de pacotes específicas por projeto, evitando conflitos no Python global",
        "Acelerar a velocidade de clock da máquina",
        "Criptografar arquivos de código-fonte"
      ],
      "answer": 1,
      "explanation": "Ambientes virtuais criam diretórios isolados com binários e bibliotecas exclusivas do projeto."
    },
    {
      "q": "O que esta query SQL faz?\n<div class=\"quiz-code-block\">DELETE FROM usuarios;</div>",
      "options": [
        "Apaga apenas os usuários inativos",
        "Apaga todos os registros da tabela usuarios, mas mantém a estrutura da tabela",
        "Destrói o banco de dados inteiro",
        "Lança um erro se não tiver a cláusula WHERE"
      ],
      "answer": 1,
      "explanation": "Sem a cláusula WHERE, DELETE apaga todas as linhas da tabela, mantendo sua definição de colunas e esquemas intactos."
    },
    {
      "q": "Qual é o resultado de 10 == '10' vs 10 === '10' em JavaScript?",
      "options": [
        "true e false (o operador == faz coerção implícita de tipo; === exige tipos estritamente idênticos)",
        "false e true",
        "true e true",
        "false e false"
      ],
      "answer": 0,
      "explanation": "== converte a string '10' para o número 10 antes da comparação. === verifica tanto o tipo quanto o valor sem coerção."
    },
    {
      "q": "No Pandas, qual a diferença entre os indexadores .loc[] e .iloc[]?",
      "options": [
        ".loc é baseado em rótulos (labels/nomes); .iloc é estritamente baseado em posições inteiras (0, 1, 2...)",
        ".loc só aceita números inteiros",
        ".iloc pesquisa na internet por índices",
        "Ambos são 100% sinônimos"
      ],
      "answer": 0,
      "explanation": ".loc['linha_a', 'coluna_b'] busca pelos nomes dos índices e colunas; .iloc[0, 1] busca estritamente pelas posições ordinais."
    }
  ],
  "4": [
    {
      "q": "Em Econometria e Estatística, qual pressuposto fundamental do estimador MQO (OLS) é violado quando há endogeneidade?",
      "options": [
        "Homocedasticidade dos erros",
        "E(u | X) = 0 (Exogeneidade estrita dos regressores)",
        "Normalidade dos resíduos",
        "Ausência de multicolinearidade perfeita"
      ],
      "answer": 1,
      "explanation": "Endogeneidade significa que Cov(X, u) != 0, violando a hipótese de exogeneidade estrita e tornando o MQO tendencioso e inconsistente."
    },
    {
      "q": "Em sistemas concorrentes, qual fenômeno ocorre quando duas ou mais threads aguardam indefinidamente por recursos bloqueados mutuamente?",
      "options": [
        "Race Condition",
        "Deadlock",
        "Livelock",
        "Starvation"
      ],
      "answer": 1,
      "explanation": "Deadlock (impasse) é o estado em que cada processo detém um recurso e aguarda o que está sob posse de outro."
    },
    {
      "q": "Qual método econométrico é padrão-ouro para estimar relações causais na presença de viés de variável omitida e endogeneidade com instrumento válido (Z)?",
      "options": [
        "LASSO Regularization",
        "2SLS (Mínimos Quadrados em 2 Estágios / IV)",
        "K-Means Clustering",
        "Random Forest Regressor"
      ],
      "answer": 1,
      "explanation": "Variáveis Instrumentais via 2SLS (Two-Stage Least Squares) isolam a variação exógena do regressor endógeno."
    },
    {
      "q": "Em programação funcional e reativa, o que caracteriza uma 'função pura' (pure function)?",
      "options": [
        "Não possui efeitos colaterais e sempre retorna o mesmo resultado para os mesmos argumentos",
        "Função que só aceita tipos primitivos",
        "Função assíncrona com Promise nativa",
        "Função escrita exclusivamente em C ou Assembly"
      ],
      "answer": 0,
      "explanation": "Funções puras possuem transparência referencial e são livres de efeitos colaterais (side effects)."
    },
    {
      "q": "Qual é o principal benefício do algoritmo de Gradient Boosting (como XGBoost ou LightGBM) em dados tabulares?",
      "options": [
        "Treina árvores independentes em paralelo sem comunicação",
        "Cada nova árvore é treinada para corrigir os erros residuais (pseudo-resíduos) do conjunto anterior",
        "Elimina completamente a necessidade de hiperparâmetros",
        "Reduz o custo assintótico para O(1)"
      ],
      "answer": 1,
      "explanation": "O Boosting constrói árvores sequencialmente, onde cada árvore subsequente foca nos resíduos das árvores anteriores."
    },
    {
      "q": "Qual é o bug neste código concorrente em Python?\n<div class=\"quiz-code-block\">saldo = 100\n\ndef sacar(valor):\n  global saldo\n  if saldo >= valor:\n    # thread dorme aqui simulando IO\n    time.sleep(0.001)\n    saldo -= valor</div>",
      "options": [
        "Sintaxe inválida no 'global'",
        "Race Condition (Condição de Corrida) por falta de Lock/Mutex no bloco crítico de saldo",
        "Deadlock inevitável",
        "Memory leak no time.sleep"
      ],
      "answer": 1,
      "explanation": "Entre a checagem 'if saldo >= valor' e a dedução 'saldo -= valor', outra thread pode executar a mesma dedução, deixando o saldo negativo (Race Condition)."
    },
    {
      "q": "Em séries temporais financeiras, o que caracteriza o fenômeno de 'volatility clustering' modelado por processos ARCH/GARCH?",
      "options": [
        "A média da série é sempre zero",
        "Períodos de alta volatilidade tendem a ser seguidos por alta volatilidade; períodos de calmaria por calmaria",
        "Os retornos são perfeitamente previsíveis linearmente",
        "A variância condicional é constante no tempo"
      ],
      "answer": 1,
      "explanation": "Agrupamento de volatilidade (Mandelbrot) expressa que grandes choques são sucedidos por grandes choques de qualquer sinal (heterocedasticidade condicional autorregressiva)."
    },
    {
      "q": "Qual é a saída deste código JavaScript devido a 'closures' e event loop?\n<div class=\"quiz-code-block\">for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}</div>",
      "options": [
        "0, 1, 2",
        "3, 3, 3",
        "undefined, undefined, undefined",
        "0, 0, 0"
      ],
      "answer": 1,
      "explanation": "Como 'var' tem escopo de função e não de bloco, todas as callbacks do setTimeout compartilham a mesma referência a 'i', cujo valor ao fim do loop é 3."
    },
    {
      "q": "Em testes de raiz unitária (como Augmented Dickey-Fuller - ADF), qual é a hipótese nula (H0)?",
      "options": [
        "A série temporal é estacionária",
        "A série temporal possui raiz unitária (não é estacionária)",
        "A série não tem autocorrelação serial",
        "Os resíduos são normalmente distribuídos"
      ],
      "answer": 1,
      "explanation": "No teste ADF, a hipótese nula H0 postula que a série possui raiz unitária (não estacionariedade). Rejeitar H0 (p < 0.05) indica estacionariedade."
    },
    {
      "q": "O que causa um 'Memory Leak' em linguagens com Garbage Collection (como Java, Go ou JS)?",
      "options": [
        "Falha física no chip de memória RAM",
        "Objetos que não são mais necessários continuam sendo referenciados por raízes ativas (ex: listeners globais não removidos)",
        "Uso excessivo de loops for",
        "Compilação de código sem otimização"
      ],
      "answer": 1,
      "explanation": "O Garbage Collector só coleta objetos inacessíveis. Se houver referências esquecidas em estruturas globais ou closures, a memória nunca é liberada."
    },
    {
      "q": "Em regularização estatística, qual é a diferença fundamental entre Ridge (L2) e Lasso (L1)?",
      "options": [
        "Ridge zera coeficientes exatamente; Lasso apenas reduz magnitudes",
        "Lasso impõe penalidade da norma L1 (|beta|), forçando coeficientes irrelevantes a zero (seleção de variáveis); Ridge (beta^2) encolhe sem zerar",
        "Ridge só funciona com 1 variável",
        "Lasso aumenta a variância do estimador"
      ],
      "answer": 1,
      "explanation": "A geometria da penalidade L1 (losango no espaço de parâmetros) permite encontrar esquinas nos eixos, zerando variáveis e gerando esparsidade."
    },
    {
      "q": "O que o Teorema de Gauss-Markov garante sobre o estimador MQO?",
      "options": [
        "Que ele é o estimador de menor erro absoluto",
        "Sob os pressupostos clássicos, ele é BLUE (Best Linear Unbiased Estimator - melhor estimador linear não tendencioso de variância mínima)",
        "Que a distribuição dos resíduos é estritamente Gaussiana",
        "Que o R² é sempre maior que 0.90"
      ],
      "answer": 1,
      "explanation": "Gauss-Markov prova que entre todos os estimadores lineares não tendenciosos, o OLS possui a menor matriz de variância-covariância."
    },
    {
      "q": "O que acontece ao tentar executar este código Python?\n<div class=\"quiz-code-block\">def outer():\n  count = 0\n  def inner():\n    count += 1\n    return count\n  return inner\n\nf = outer()\nf()</div>",
      "options": [
        "Retorna 1 com sucesso",
        "Lança UnboundLocalError: local variable 'count' referenced before assignment",
        "Lança TypeError",
        "Retorna None"
      ],
      "answer": 1,
      "explanation": "Em Python, atribuir a 'count' dentro de inner faz o compilador tratá-lo como variável local, falhando antes de ler o valor externo. Requer a palavra-chave 'nonlocal count'."
    },
    {
      "q": "Qual é o risco do fenômeno de 'Regressão Espúria' em séries temporais?",
      "options": [
        "O modelo demora muito para convergir",
        "Duas séries com tendências temporais estocásticas independentes exibem R² alto e t-statistic significativo puramente por derivarem no tempo",
        "A matriz X'X se torna inversível",
        "Os resíduos tornam-se homocedásticos"
      ],
      "answer": 1,
      "explanation": "Granger e Newbold (1974) provaram que regredir séries integradas I(1) não cointegradas produz estatísticas t infladas e relações causais fictícias."
    },
    {
      "q": "O que é 'Cache Invalidation' e por que é considerada uma das tarefas mais difíceis da Ciência da Computação?",
      "options": [
        "Limpar os cookies do navegador manualmente",
        "Garantir que cópias replicadas em cache sejam atualizadas ou expiradas no instante exato em que os dados na fonte primária são modificados",
        "Destruir a memória cache L1 do processador",
        "Desinstalar o banco de dados Redis"
      ],
      "answer": 1,
      "explanation": "Como formulado por Phil Karlton: 'Há apenas duas coisas difíceis na Ciência da Computação: invalidação de cache e nomear coisas'."
    },
    {
      "q": "O que o Teorema de Coase estabelece a respeito de externalidades em economia?",
      "options": [
        "O governo sempre deve impor impostos pigouvianos",
        "Se os custos de transação forem nulos e os direitos de propriedade forem bem definidos, os agentes negociarão a alocação socialmente ótima independentemente da titularidade inicial",
        "Monopólios geram eficiência perfeita",
        "Bens públicos devem ser privatizados"
      ],
      "answer": 1,
      "explanation": "Sob custos de transação zero e direitos claros, a negociação privada internaliza a externalidade de forma eficiente."
    },
    {
      "q": "Qual é a principal razão pela qual o Global Interpreter Lock (GIL) existe no CPython?",
      "options": [
        "Aumentar o poder de computação gráfica",
        "Simplificar o gerenciamento de memória thread-safe e evitar race conditions no sistema de contagem de referências do interpretador",
        "Impedir que programas usem conexões de rede",
        "Proibir o uso de funções recursivas"
      ],
      "answer": 1,
      "explanation": "O GIL protege o subsistema de contagem de referências do CPython contra acessos concorrentes em nível de C, impedindo threads Python de executar bytecode em múltiplos cores em paralelo."
    },
    {
      "q": "Em modelagem macroeconômica, o que é a Crítica de Lucas (1976)?",
      "options": [
        "Afirma que computadores não conseguem calcular equilíbrios",
        "Parâmetros estimados de modelos macroeconométricos históricos não são invariantes a mudanças nas regras de política econômica, pois agentes racionais adaptam suas expectativas",
        "O modelo IS-LM é sempre exato",
        "Taxas de juros nunca afetam o câmbio"
      ],
      "answer": 1,
      "explanation": "Robert Lucas demonstrou que formular políticas assumindo que os parâmetros econométricos agregados são fixos falha porque os agentes modificam seu comportamento sob novas regras."
    },
    {
      "q": "Em bancos de dados distribuídos, qual é a anomalia 'Dirty Read' no nível de isolamento de transação?",
      "options": [
        "Uma transação lê dados modificados por outra transação que ainda NÃO foi comitada e que pode sofrer ROLLBACK",
        "Duas transações alteram a mesma chave ao mesmo tempo",
        "O banco de dados grava dados corrompidos no HD",
        "Uma transação apaga o esquema do banco"
      ],
      "answer": 0,
      "explanation": "Dirty Read ocorre no nível Read Uncommitted: a transação A consome alterações transitórias da transação B antes de B efetivar ou abortar."
    },
    {
      "q": "Qual o impacto da multicolinearidade quase-perfeita nos regressores de um modelo econométrico?",
      "options": [
        "Viés sistemático nos estimadores de coeficientes",
        "Inflação na variância dos coeficientes (erros padrão altíssimos), tornando testes t não significativos individualmente apesar de F global significativo",
        "O R² cai para zero",
        "Os resíduos deixam de somar zero"
      ],
      "answer": 1,
      "explanation": "Multicolinearidade não enviesa os betas, mas torna a matriz X'X quase singular, explodindo os erros padrão e a imprecisão das estimativas."
    },
    {
      "q": "O que caracteriza uma arquitetura orientada a microsserviços com padrão Event-Driven (orientada a eventos)?",
      "options": [
        "Serviços chamam uns aos outros exclusivamente via HTTP síncrono",
        "Serviços se comunicam de forma assíncrona publicando e consumindo eventos em tópicos (Message Brokers como Kafka ou RabbitMQ), desacoplando produtores e consumidores",
        "Todo o banco de dados reside na mesma tabela",
        "Não existem servidores em nuvem"
      ],
      "answer": 1,
      "explanation": "Arquiteturas orientadas a eventos promovem desacoplamento temporal e espacial entre serviços através de barramentos de mensagens assíncronas."
    },
    {
      "q": "O que o Teste de Durbin-Watson avalia em uma regressão linear?",
      "options": [
        "Normalidade dos erros",
        "Autocorrelação de primeira ordem nos resíduos",
        "Heterocedasticidade de White",
        "Endogeneidade dos instrumentos"
      ],
      "answer": 1,
      "explanation": "O teste d de Durbin-Watson testa se os resíduos de uma série temporal possuem autocorrelação de ordem 1 (valor próximo a 2 indica ausência de autocorrelação)."
    },
    {
      "q": "Qual é a complexidade assintótica do algoritmo Dijkstra implementado com uma Fila de Prioridades (Min-Heap)?",
      "options": [
        "O(V^2)",
        "O((V + E) log V)",
        "O(V * E)",
        "O(V!)"
      ],
      "answer": 1,
      "explanation": "Com binary heap, cada extração de mínimo custa O(log V) e cada relaxamento de aresta custa O(log V), totalizando O((V + E) log V)."
    },
    {
      "q": "O que é 'Curse of Dimensionality' (Maldição da Dimensionalidade) no aprendizado de máquina?",
      "options": [
        "Modelos que demoram para inicializar",
        "À medida que o número de variáveis cresce, o volume do espaço cresce exponencialmente, tornando os dados esparsos e exigindo exponencialmente mais amostras",
        "O erro de treino sempre zera",
        "Perda de precisão numérica de 64 bits para 32 bits"
      ],
      "answer": 1,
      "explanation": "Em espaços de alta dimensão, todos os pontos tendem a ficar equidistantes entre si, prejudicando métricas euclidianas e algoritmos baseados em vizinhança."
    },
    {
      "q": "Qual teste estatístico é indicado para verificar a presença de heterocedasticidade sem depender da hipótese de normalidade dos erros?",
      "options": [
        "Teste de Jarque-Bera",
        "Teste de White (ou Breusch-Pagan)",
        "Teste de Chow",
        "Teste de Dickey-Fuller"
      ],
      "answer": 1,
      "explanation": "O Teste Geral de White regride os resíduos ao quadrado contra os regressores originais, seus quadrados e produtos cruzados para detectar variância não constante."
    },
    {
      "q": "Em concorrência, o que significa a propriedade 'Linearizability' (Linearizabilidade)?",
      "options": [
        "O código é formatado em linha única",
        "Cada operação concorrente parece tomar efeito instantaneamente em algum ponto no tempo entre seu início e fim, comportando-se como se houvesse apenas uma cópia atômica",
        "Todas as requisições demoram exatamente o mesmo tempo",
        "Nenhum lock é utilizado no sistema"
      ],
      "answer": 1,
      "explanation": "Linearizabilidade é uma das condições mais estritas de consistência concorrente, garantindo que operações atômicas respeitem a ordem cronológica real observável."
    },
    {
      "q": "No modelo CAPM (Capital Asset Pricing Model), o que representa o coeficiente Beta (beta)?",
      "options": [
        "O retorno livre de risco da economia",
        "A sensibilidade do retorno do ativo em relação às variações da carteira de mercado (risco sistemático não diversificável)",
        "O desvio padrão idiossincrático da empresa",
        "O índice de Sharpe do portfólio"
      ],
      "answer": 1,
      "explanation": "Beta mede Cov(Ri, Rm) / Var(Rm): o grau de exposição ao risco sistemático que não pode ser eliminado via diversificação."
    },
    {
      "q": "O que faz a técnica de Sharding em arquiteturas de bancos de dados?",
      "options": [
        "Cria backups em fita magnética",
        "Particiona horizontalmente uma base de dados em múltiplos servidores físicos distintos, distribuindo linhas com base em uma Shard Key",
        "Converte tabelas relacionais em documentos JSON",
        "Desativa os índices para poupar memória"
      ],
      "answer": 1,
      "explanation": "Sharding é o particionamento horizontal que permite escalar escritas e leituras além dos limites de hardware de uma única máquina."
    },
    {
      "q": "Em redes neurais profundas, qual fenômeno o mecanismo de 'Residual Connections' (ResNet) resolveu com sucesso?",
      "options": [
        "Desaparecimento do Gradiente (Vanishing Gradient), permitindo treinar redes com centenas de camadas adicionando conexões de atalho (x + F(x))",
        "Eliminou o consumo de memória de GPU",
        "Substituiu a função de perda Cross-Entropy",
        "Dispensou o uso de backpropagation"
      ],
      "answer": 0,
      "explanation": "As conexões residuais (skip connections) permitem que o gradiente flua diretamente pelas camadas sem sofrer decaimento exponencial durante a retropropagação."
    },
    {
      "q": "Qual é a principal premissa da Hipótese dos Mercados Eficientes (EMH) em sua forma semi-forte?",
      "options": [
        "Os preços dos ativos refletem instantaneamente todas as informações publicamente disponíveis, impedindo retornos anormais consistentes via análise fundamentalista",
        "Os preços refletem apenas informações históricas de preços",
        "Nenhum investidor perde dinheiro na bolsa",
        "Informações privilegiadas (insider) são públicas"
      ],
      "answer": 0,
      "explanation": "A forma semi-forte estabelece que balanços, notícias e dados públicos já estão precificados no instante em que se tornam conhecidos."
    }
  ],
  "5": [
    {
      "q": "Como o WebAssembly (Wasm) consegue atingir desempenho quase nativo dentro do sandbox de navegadores modernos?",
      "options": [
        "Executando com privilégios de root no sistema operacional",
        "Formato binário pré-otimizado (bytecode) com tipos estáticos compilado via JIT diretamente para instruções de máquina locais",
        "Convertendo código C em JavaScript interpretado em tempo de execução",
        "Desativando o coletor de lixo do navegador"
      ],
      "answer": 1,
      "explanation": "Wasm é um bytecode estruturado de baixo nível que os motores de browser (V8, SpiderMonkey) compilam em código de máquina nativo rapidamente."
    },
    {
      "q": "Em C e C++, o que significa 'Undefined Behavior' (UB) segundo o padrão da linguagem?",
      "options": [
        "O programa emite um aviso silencioso no console",
        "O compilador tem permissão de assumir que tal situação nunca acontece, podendo gerar qualquer código de máquina, falha catastrófica ou otimizações bizarras",
        "A função retorna automaticamente NULL",
        "O SO encerra a thread sem desalocar ponteiros"
      ],
      "answer": 1,
      "explanation": "Undefined Behavior impõe zero requisitos ao compilador: tudo é permitido, desde crash até remoção de checagens pelo otimizador."
    },
    {
      "q": "Em arquiteturas de processadores modernos (x86_64, ARM64), qual técnica de otimização de hardware pode falhar e causar descarte de pipeline (pipeline stall)?",
      "options": [
        "Branch Prediction (Previsão de Desvio)",
        "Garbage Collection",
        "DMA Transfer",
        "Memory Paging"
      ],
      "answer": 0,
      "explanation": "Quando o preditor de desvios erra (branch misprediction), todas as instruções especulativas no pipeline devem ser descartadas."
    },
    {
      "q": "O que é o Teorema CAP para sistemas distribuídos de armazenamento de dados?",
      "options": [
        "Afirma que é impossível garantir simultaneamente Consistência, Disponibilidade e Tolerância a Partições de rede",
        "Prova que qualquer algoritmo de ordenação pode ser O(n)",
        "Determina a taxa máxima de compressão de Shannon",
        "Garante a atomicidade absoluta de transações ACID em nuvem"
      ],
      "answer": 0,
      "explanation": "O Teorema de Brewer (CAP) prova que um sistema distribuído pode escolher no máximo duas das três garantias sob partição."
    },
    {
      "q": "No kernel Linux e em engines de alta performance (como V8), qual é o objetivo de usar estruturas 'Lock-Free' baseadas em primitivas CAS (Compare-And-Swap)?",
      "options": [
        "Eliminar mutexes e esperas ativas, garantindo progresso do sistema mesmo se alguma thread for suspensa",
        "Garantir acesso compartilhado sem uso de memória RAM",
        "Aumentar o consumo de CPU em segundo plano",
        "Criptografar ponteiros em registradores"
      ],
      "answer": 0,
      "explanation": "Estruturas Lock-Free garantem que pelo menos uma thread ativa no sistema conclui sua operação em passos finitos, sem bloqueio de mutex."
    },
    {
      "q": "Qual é a vulnerabilidade de segurança explorada no ataque Spectre em CPUs modernas?",
      "options": [
        "Execução Especulativa (Speculative Execution) combinada com vazamento de dados através de canais laterais na memória Cache da CPU (Side-Channel Attack)",
        "Injeção de SQL no firmware da BIOS",
        "Estouro de pilha no interpretador Python",
        "Superaquecimento forçado da GPU"
      ],
      "answer": 0,
      "explanation": "Spectre induz a CPU a executar instruções especulativas além dos limites de privilégio e observa o tempo de acesso à cache para recuperar segredos da memória."
    },
    {
      "q": "Em gerenciamento de memória virtual, o que é um 'TLB Shootdown'?",
      "options": [
        "Quando o Translation Lookaside Buffer de múltiplos núcleos precisa ser invalidado via interrupções inter-processadores (IPI), gerando alto overhead de sincronização",
        "Quando um processo é eliminado por falta de RAM",
        "Quando a memória swap é desativada",
        "Uma falha catastrófica de hardware no barramento PCIe"
      ],
      "answer": 0,
      "explanation": "Quando uma página de memória tem suas permissões ou mapeamento alterados, a CPU precisa forçar todos os outros cores a invalidarem suas caches de tradução de endereços (TLB)."
    },
    {
      "q": "O que a instrução de barreira de memória (Memory Barrier / Memory Fence) faz em compiladores e processadores com modelo de consistência fraca (Weak Memory Model)?",
      "options": [
        "Impede o SO de alocar mais páginas",
        "Impede a reordenação de leituras e escritas de memória pela CPU e pelo compilador através do ponto da barreira",
        "Trava todas as threads até o fim do programa",
        "Limpa os registradores de ponto flutuante"
      ],
      "answer": 1,
      "explanation": "Processadores modernos (como ARM) e compiladores reordenam instruções agressivamente. Uma barreira garante que escritas anteriores sejam visíveis antes de leituras posteriores."
    },
    {
      "q": "Qual é o problema conhecido como 'False Sharing' em programação multithread de alta performance?",
      "options": [
        "Duas threads usam a mesma senha de acesso",
        "Duas threads em cores distintos modificam variáveis independentes que residem na mesma linha de cache da CPU (Cache Line), invalidando a linha inteira mutuamente e destruindo a performance",
        "Quando a memória compartilhada é acessada sem autenticação",
        "Quando duas variáveis apontam para o mesmo ponteiro nulo"
      ],
      "answer": 1,
      "explanation": "Como a coerência de cache (protocolos MESI/MOESI) opera em blocos de 64 bytes (cache lines), modificar variáveis adjacentes força re-sincronizações constantes entre os núcleos."
    },
    {
      "q": "No protocolo de consenso Paxos / Raft, para que serve o mecanismo de Quorum de Maioria (Majority Quorum)?",
      "options": [
        "Para garantir que dois líderes concorrentes (Split-Brain) nunca consigam comitar logs contraditórios simultaneamente, pois duas maiorias sempre se interceptam em pelo menos 1 nó",
        "Para criptografar as mensagens trocadas",
        "Para comprimir os arquivos de snapshot",
        "Para desligar nós lentos automaticamente"
      ],
      "answer": 0,
      "explanation": "Qualquer conjunto de maioria em um cluster de N nós sempre tem pelo menos um nó em comum com qualquer outra maioria, garantindo consistência estrita sob partições de rede."
    },
    {
      "q": "Qual é a diferença conceitual entre compilação JIT (Just-In-Time) e AOT (Ahead-Of-Time)?",
      "options": [
        "JIT compila o código para instruções de máquina nativas durante a execução do programa usando dados de perfil dinâmico; AOT compila antes da distribuição",
        "AOT só funciona para código interpretado",
        "JIT consome zero memória RAM",
        "Não existem compiladores AOT para linguagens modernas"
      ],
      "answer": 0,
      "explanation": "JITs (como V8 e PyPy) usam telemetria em tempo real para otimizar os caminhos quentes (hot paths) do código em tempo de execução."
    },
    {
      "q": "Em chamadas de sistema no Linux, qual é a principal vantagem de usar 'io_uring' em relação ao tradicional 'epoll'?",
      "options": [
        "io_uring é escrito em Python nativo",
        "io_uring permite E/S assíncrona real através de ring buffers compartilhados no kernel sem trocas de contexto (context switch) por operação",
        "epoll não suporta sockets TCP",
        "io_uring não utiliza descritores de arquivo"
      ],
      "answer": 1,
      "explanation": "io_uring usa dois submission/completion queues em memória mapeada, permitindo submeter e colher operações de disco e rede sem entrar no kernel via syscall repetidamente."
    },
    {
      "q": "O que causa um 'Stack Overflow' em nível de arquitetura de computador?",
      "options": [
        "A memória Heap atinge 100% de uso",
        "O ponteiro de pilha (Stack Pointer - RSP) ultrapassa os limites alocados para a região de stack da thread (frequentemente por recursão infinita), violando páginas de guarda (Guard Pages)",
        "O disco rígido corrompe a MBR",
        "Um erro de arredondamento em ponto flutuante de 64 bits"
      ],
      "answer": 1,
      "explanation": "A pilha de execução (call stack) tem tamanho fixo por thread (geralmente 1MB a 8MB). Chamadas excessivas empilham stack frames até atingir a página de proteção do SO, disparando SIGSEGV."
    },
    {
      "q": "Em bancos de dados analíticos (OLAP) como ClickHouse e DuckDB, qual é a vantagem fundamental do armazenamento colunar (Columnar Storage) sobre o armazenamento por linhas (Row-Oriented)?",
      "options": [
        "Permite transações ACID com locks mais rápidos",
        "Permite ler apenas as colunas necessárias para a agregação, alcançando alta compressão de dados semelhantes e execução vetorial com instruções SIMD",
        "Elimina a necessidade de memória RAM",
        "Garante que o banco nunca use índices"
      ],
      "answer": 1,
      "explanation": "Consultas OLAP agregam poucas colunas em bilhões de linhas. O formato colunar lê apenas os bytes estritamente necessários do disco e processa múltiplos valores por ciclo de CPU via SIMD."
    },
    {
      "q": "O que o algoritmo de coletor de lixo 'Generational Garbage Collection' assume sobre o ciclo de vida dos objetos (Hipótese Geracional Fraca)?",
      "options": [
        "Todos os objetos vivem o mesmo tempo",
        "A grande maioria dos objetos morre logo após ser criada (infant mortality), permitindo focar coletas rápidas na geração jovem (Young Generation / Eden)",
        "Objetos antigos consomem menos memória",
        "Objetos nunca são promovidos de geração"
      ],
      "answer": 1,
      "explanation": "A 'Weak Generational Hypothesis' constata que objetos alocados temporariamente em métodos morrem quase imediatamente, tornando extremamente eficiente coletar apenas o berçário (Eden)."
    },
    {
      "q": "O que é o fenômeno 'ABA Problem' em algoritmos Lock-Free e como ele é tipicamente contornado?",
      "options": [
        "Quando uma variável tem o valor alterado de A para B e depois volta para A, enganando um CAS simples; contorna-se usando ponteiros com contadores de versão (Tag/Version Counters)",
        "Uma falha na tradução de UTF-8",
        "Quando um socket recebe pacotes fora de ordem",
        "Um erro de arredondamento IEEE 754"
      ],
      "answer": 0,
      "explanation": "Se uma thread lê A, outra altera para B e depois restaura para A, o Compare-And-Swap acha que nada mudou e comete erro de consistência. Resolve-se com ponteiros com tags de contagem de ciclo."
    },
    {
      "q": "O que é 'Escape Analysis' em compiladores otimizadores modernos (como HotSpot JVM ou Go)?",
      "options": [
        "Análise para detectar caracteres de escape em strings SQL",
        "Técnica para determinar se um objeto alocado escapa do escopo da função; se não escapar, o compilador aloca o objeto na Pilha (Stack) em vez da Heap, eliminando trabalho do GC",
        "Verificação de saídas prematuras de loops",
        "Mapeamento de exceções em tempo de compilação"
      ],
      "answer": 1,
      "explanation": "Alocar na stack tem custo praticamente zero (apenas mover o stack pointer), e o objeto é desalocado imediatamente no retorno do método sem gerar pressão sobre o coletor de lixo."
    },
    {
      "q": "Por que o número decimal 0.1 não pode ser representado de forma exata no padrão de ponto flutuante binário IEEE 754 de precisão dupla?",
      "options": [
        "Porque o padrão limita números a 32 bits",
        "Porque 0.1 em base binária é uma dízima periódica infinita (0.0001100110011...), sofrendo truncamento no número finito de bits da mantissa",
        "Porque o processador desliga o bit de sinal",
        "Porque zero não é permitido após a vírgula"
      ],
      "answer": 1,
      "explanation": "Assim como 1/3 é uma dízima em base 10 (0.333...), 1/10 não possui representação finita em potências de 2 (base binária), gerando o clássico 0.1 + 0.2 != 0.3."
    },
    {
      "q": "Em redes de computadores, o que é o 'Head-of-Line Blocking' (HOL Blocking) e como o protocolo HTTP/3 (QUIC sobre UDP) o eliminou?",
      "options": [
        "No TCP, se um pacote é perdido, todas as streams subsequentes ficam bloqueadas esperando a retransmissão; o QUIC implementa streams independentes sobre UDP sem bloqueio mútuo",
        "Bloqueio de conexões devido a senhas erradas",
        "Atraso causado pela renderização de imagens no browser",
        "Falta de certificados SSL"
      ],
      "answer": 0,
      "explanation": "O HTTP/2 sofria de HOL blocking no nível de transporte TCP. O HTTP/3 utiliza QUIC (UDP) onde perdas de pacotes atrasam apenas o stream específico afetado, mantendo os demais fluindo."
    },
    {
      "q": "O que faz a técnica de 'Copy-On-Write' (COW) durante a execução de um fork() no Linux?",
      "options": [
        "Duplica imediatamente todos os gigabytes de memória física do processo pai para o filho",
        "Pai e filho compartilham as mesmas páginas físicas marcadas como somente leitura; uma nova cópia de página só é alocada quando um dos processos tenta escrever nela",
        "Grava o estado da memória no disco rígido antes de bifurcar",
        "Bloqueia o processo filho até o pai terminar"
      ],
      "answer": 1,
      "explanation": "Copy-On-Write torna a criação de processos extremamente leve e instantânea, evitando duplicar páginas que nunca serão modificadas."
    },
    {
      "q": "Qual é a função do algoritmo de criptografia Diffie-Hellman na negociação de chaves em conexões TLS/HTTPS?",
      "options": [
        "Permitir que duas partes concordem com uma chave secreta compartilhada sobre um canal público inseguro sem que nenhum observador consiga deduzi-la",
        "Autenticar o CPF do usuário",
        "Comprimir os dados da página web",
        "Gerar números pseudoaleatórios na CPU"
      ],
      "answer": 0,
      "explanation": "Baseado na dificuldade do problema do Logaritmo Discreto, Diffie-Hellman permite o estabelecimento de uma chave simétrica efêmera sem que ela viaje pela rede."
    },
    {
      "q": "O que significa 'Loop Unrolling' (Desenrolamento de Laço) em otimização de compiladores?",
      "options": [
        "Transformar loops infinitos em condicionais",
        "Replicar o corpo do laço múltiplas vezes para diminuir o número de saltos condicionais (branches) e aumentar as oportunidades de escalonamento de instruções e vetorização",
        "Converter o código para recursão",
        "Impedir que variáveis sejam alteradas"
      ],
      "answer": 1,
      "explanation": "Reduz o overhead de testar a condição e incrementar o contador a cada passo, permitindo que a CPU processe múltiplas iterações em paralelo."
    },
    {
      "q": "O que caracteriza a vulnerabilidade 'Rowhammer' em módulos de memória física DRAM?",
      "options": [
        "Aquecimento do processador até falha",
        "Acessar repetidamente e em alta frequência certas linhas de células de DRAM provoca vazamento de carga elétrica em linhas vizinhas, alterando bits de dados sem autorização (bit flip)",
        "Ataque de negação de serviço na porta 80",
        "Injeção de comandos no kernel via SSH"
      ],
      "answer": 1,
      "explanation": "Rowhammer é uma falha física de isolamento capacitivo na miniaturização das memórias modernas, permitindo escalonamento de privilégio puramente por acessos rápidos à memória."
    },
    {
      "q": "Em arquiteturas de microsserviços e sistemas transacionais, qual é a função do padrão Saga (Orquestrada ou Coreografada)?",
      "options": [
        "Substituir o protocolo TCP por UDP",
        "Gerenciar consistência eventual em transações distribuídas através de uma série de transações locais acompanhadas de ações compensatórias em caso de falha",
        "Garantir latência de 0 milissegundos",
        "Eliminar o uso de bancos de dados relacionais"
      ],
      "answer": 1,
      "explanation": "Como transações distribuídas 2PC (Two-Phase Commit) travam sob partições de rede, Sagas coordenam passos locais e transações de compensação (rollbacks lógicos) sem bloqueio global."
    },
    {
      "q": "Qual é a propriedade fundamental de uma Função Hash Criptográfica (como SHA-256) conhecida como 'Efeito Avalanche' (Avalanche Effect)?",
      "options": [
        "A função executa de forma decrescente no tempo",
        "Uma modificação de apenas 1 único bit na entrada resulta em uma mudança imprevisível de aproximadamente 50% dos bits na saída calculada",
        "A função só funciona em servidores refrigerados",
        "O hash gerado sempre diminui de tamanho"
      ],
      "answer": 1,
      "explanation": "O rigoroso espalhamento garante que saídas de entradas semelhantes não tenham correlação estatística observável."
    },
    {
      "q": "Em compiladores, o que é a representação intermediária 'Static Single Assignment' (SSA Form)?",
      "options": [
        "Código onde nenhuma função pode retornar valores",
        "Uma representação onde cada variável é atribuída exatamente uma única vez, simplificando imensamente análises de fluxo de dados e otimizações como eliminação de código morto",
        "Uma forma de bytecode estritamente mono-thread",
        "Uma restrição da linguagem Rust"
      ],
      "answer": 1,
      "explanation": "Na forma SSA (usada no LLVM e GCC), versões de variáveis (x1, x2...) eliminam ambiguidades de escopo e facilitam propagação de constantes e remoção de redundâncias."
    },
    {
      "q": "O que o algoritmo de consenso Raft faz durante a fase de 'Log Compaction'?",
      "options": [
        "Deleta o histórico de logs e salva um Snapshot do estado atual da máquina de estados no disco para evitar que o log cresça infinitamente",
        "Criptografa as mensagens com AES-GCM",
        "Derruba os nós seguidores que ficaram para trás",
        "Converte os comandos para JSON"
      ],
      "answer": 0,
      "explanation": "Sem snapshots periódicos, nós novos ou reiniciados precisariam reproduzir milhões de transações do zero para sincronizar o estado."
    },
    {
      "q": "Em engenharia de confiabilidade de software (Chaos Engineering), qual é o propósito de ferramentas como o Chaos Monkey?",
      "options": [
        "Gerar dados falsos no banco de testes",
        "Desligar servidores e serviços em produção de forma pseudoaleatória para testar a resiliência e auto-recuperação do sistema em falhas reais",
        "Injetar código malicioso para testes de penetração",
        "Fazer benchmark de velocidade de disco"
      ],
      "answer": 1,
      "explanation": "Criado pela Netflix, valida se a arquitetura distribuída sobrevive à perda inesperada de instâncias sem degradar o usuário final."
    },
    {
      "q": "O que é 'NUMA' (Non-Uniform Memory Access) em servidores multiprocessados modernos?",
      "options": [
        "Arquitetura onde cada soquete de CPU possui sua própria controladora e barramento local de memória; acessar a RAM do soquete vizinho (remoto) tem maior latência",
        "Memória RAM sem canais de paridade ECC",
        "Uma biblioteca gráfica de alta definição",
        "Um protocolo de rede para roteadores"
      ],
      "answer": 0,
      "explanation": "Em sistemas NUMA, threads devem idealmente processar dados alocados nos nós de memória física diretamente conectados ao seu soquete para evitar estrangulamento do barramento inter-CPU (QPI/UPI)."
    },
    {
      "q": "O que a instrução atômica 'Fetch-And-Add' (FAA) garante em hardware?",
      "options": [
        "Lê o valor de uma posição de memória e incrementa-o em uma única operação atômica de barramento sem interrupção de outras CPUs",
        "Copia um array inteiro para a cache",
        "Calcula a raiz quadrada de inteiros de 64 bits",
        "Limpa a tabela de páginas virtuais"
      ],
      "answer": 0,
      "explanation": "FAA é suportada diretamente em nível de microcódigo de CPU (ex: LOCK XADD em x86), sendo indispensável para filas de alta vazão e contadores atômicos."
    }
  ]
};

  const LEVEL_NAMES = {
    1: { title: "Iniciante", tag: "Lógica, Pseudocódigo & Fundamentos", color: "#10B981", points: 100 },
    2: { title: "Júnior", tag: "Python, R & Estruturas de Dados", color: "#38BDF8", points: 200 },
    3: { title: "Pleno", tag: "SQL, Algoritmos & Pipelines", color: "#818CF8", points: 350 },
    4: { title: "Sênior", tag: "Econometria & Concorrência", color: "#F59E0B", points: 500 },
    5: { title: "Mestre", tag: "Wasm, Compiladores & Kernel", color: "#EF4444", points: 800 }
  };

  let currentLevel = 1;
  let currentQuestionIndex = 0;
  let currentScore = 0;
  let answeredQuestions = 0;
  let correctAnswers = 0;
  let currentQuestionsList = [];
  let userSelectedOption = null;

  // Embaralha array com Fisher-Yates
  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Carrega Leaderboard do LocalStorage (Apenas pontuações reais registradas por usuários)
  function getLeaderboard() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch(e) {}
    return [];
  }

  function saveScore(name, score, level) {
    if (!name) name = "Dev_Anonimo";
    const lb = getLeaderboard();
    const entry = {
      name: name.slice(0, 16),
      score: score,
      level: LEVEL_NAMES[level]?.title || `Nível ${level}`,
      date: new Date().toISOString().split('T')[0]
    };
    lb.push(entry);
    lb.sort((a, b) => b.score - a.score);
    const top10 = lb.slice(0, 10);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
    } catch(e) {}
    return top10;
  }

  // --- Renderização da Leaderboard ---
  window.launchLeaderboard = function(containerEl) {
    if (!containerEl) return;
    const lb = getLeaderboard();

    containerEl.innerHTML = `
      <div class="quiz-overlay-game">
        <div class="quiz-header">
          <div class="quiz-title">
            <span class="quiz-icon">🏆</span>
            <div>
              <strong>HALL DA FAMA · LEADERBOARD ECONDATA</strong>
              <small>Top Pontuações Reais do Quiz de Programação</small>
            </div>
          </div>
          <button class="chess-btn-icon" onclick="window.closeQuizGame()" title="Fechar">✕</button>
        </div>

        <div class="quiz-leaderboard-table-wrap">
          ${lb.length === 0 ? `
            <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
              <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📜</div>
              <strong style="color: var(--text-main); font-size: 0.95rem;">Nenhuma pontuação registrada ainda</strong>
              <p style="font-size: 0.8rem; margin-top: 0.35rem;">Seja o primeiro a jogar o Quiz e gravar seu nome na Leaderboard!</p>
            </div>
          ` : `
            <table class="quiz-lb-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Desenvolvedor</th>
                  <th>Nível</th>
                  <th>Pontos</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                ${lb.map((item, idx) => `
                  <tr class="${idx === 0 ? 'top-1' : idx === 1 ? 'top-2' : idx === 2 ? 'top-3' : ''}">
                    <td class="lb-rank">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</td>
                    <td class="lb-name"><strong>${item.name}</strong></td>
                    <td class="lb-level"><span class="quiz-tag-pill">${item.level}</span></td>
                    <td class="lb-score tabular-num">${item.score} pts</td>
                    <td class="lb-date">${item.date}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>

        <div class="quiz-actions" style="margin-top: 1rem;">
          <button class="console-btn-action" onclick="window.launchQuizGame(document.getElementById('console-plot-area'))">Jogar o Quiz Agora</button>
          <button class="console-btn-action" onclick="window.closeQuizGame()">Fechar</button>
        </div>
      </div>
    `;
  };

  // --- Inicialização do Quiz ---
  window.launchQuizGame = function(containerEl) {
    if (!containerEl) return;
    currentLevel = 1;
    currentQuestionIndex = 0;
    currentScore = 0;
    answeredQuestions = 0;
    correctAnswers = 0;
    userSelectedOption = null;

    renderLevelSelection(containerEl);
  };

  function renderLevelSelection(containerEl) {
    containerEl.innerHTML = `
      <div class="quiz-overlay-game">
        <div class="quiz-header">
          <div class="quiz-title">
            <span class="quiz-icon">🧠</span>
            <div>
              <strong>TECH & DATA QUIZ · EconData Analytics</strong>
              <small>Banco com mais de 150 questões em 5 níveis de dificuldade</small>
            </div>
          </div>
          <div class="quiz-stats">
            <button class="console-btn-action" onclick="window.launchLeaderboard(document.getElementById('console-plot-area'))" style="font-size: 0.72rem; padding: 4px 8px;">🏆 Ver Leaderboard</button>
            <button class="chess-btn-icon" onclick="window.closeQuizGame()" title="Fechar">✕</button>
          </div>
        </div>

        <div class="quiz-level-picker-intro">
          <p>Escolha o nível desejado. Cada partida sorteia <strong>5 questões inéditas</strong> do banco do nível com explicações técnicas e pontuações proporcionais:</p>
        </div>

        <div class="quiz-levels-grid">
          ${[1, 2, 3, 4, 5].map(lvl => {
            const meta = LEVEL_NAMES[lvl];
            const totalInBank = QUIZ_QUESTIONS[lvl]?.length || 30;
            return `
              <div class="quiz-level-card" onclick="window.startQuizAtLevel(${lvl})">
                <div class="qlc-header">
                  <span class="qlc-badge" style="background: ${meta.color}22; color: ${meta.color}; border: 1px solid ${meta.color}55;">Nível ${lvl} · ${meta.title}</span>
                  <span class="qlc-pts">+${meta.points} pts / acerto</span>
                </div>
                <h4>${meta.tag}</h4>
                <p>5 questões sorteadas de um banco com ${totalInBank} perguntas técnicas.</p>
              </div>
            `;
          }).join('')}
        </div>

        <div class="quiz-actions" style="margin-top: 1.25rem;">
          <button class="console-btn-action" onclick="window.closeQuizGame()">Voltar ao Console R</button>
        </div>
      </div>
    `;
  }

  window.startQuizAtLevel = function(lvl) {
    currentLevel = lvl;
    currentQuestionIndex = 0;
    // Sorteia 5 questões aleatórias do banco de 30+ questões daquele nível
    const shuffled = shuffleArray(QUIZ_QUESTIONS[lvl]);
    currentQuestionsList = shuffled.slice(0, 5);
    userSelectedOption = null;
    renderCurrentQuestion();
  };

  function renderCurrentQuestion() {
    const containerEl = document.getElementById('console-plot-area');
    if (!containerEl) return;

    const meta = LEVEL_NAMES[currentLevel];
    const qData = currentQuestionsList[currentQuestionIndex];
    if (!qData) {
      renderLevelCompleted();
      return;
    }

    containerEl.innerHTML = `
      <div class="quiz-overlay-game">
        <div class="quiz-header">
          <div class="quiz-title">
            <span class="quiz-icon">⚡</span>
            <div>
              <strong>NÍVEL ${currentLevel} · ${meta.title.toUpperCase()}</strong>
              <small>${meta.tag}</small>
            </div>
          </div>
          <div class="quiz-stats">
            <span class="quiz-score-badge">Pontuação: <strong class="tabular-num">${currentScore}</strong> pts</span>
            <span class="quiz-qnum">Questão ${currentQuestionIndex + 1}/5</span>
            <button class="chess-btn-icon" onclick="window.closeQuizGame()" title="Fechar">✕</button>
          </div>
        </div>

        <div class="quiz-question-box">
          <div class="quiz-q-text">${qData.q}</div>
        </div>

        <div class="quiz-options-list" id="quizOptionsList">
          ${qData.options.map((opt, idx) => `
            <button class="quiz-option-btn" onclick="window.handleSelectOption(${idx})" id="qOpt_${idx}">
              <span class="quiz-opt-letter">${String.fromCharCode(65 + idx)}</span>
              <span class="quiz-opt-text">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div class="quiz-feedback-box" id="quizFeedbackBox" style="display: none;"></div>

        <div class="quiz-footer-actions">
          <button class="console-btn-action" id="btnNextQuestion" onclick="window.handleNextQuestion()" style="display: none;">Próxima Questão ➔</button>
          <button class="console-btn-action" onclick="window.launchQuizGame(document.getElementById('console-plot-area'))">Trocar Nível</button>
          <button class="console-btn-action" onclick="window.launchLeaderboard(document.getElementById('console-plot-area'))">🏆 Leaderboard</button>
        </div>
      </div>
    `;
  }

  window.handleSelectOption = function(selectedIdx) {
    if (userSelectedOption !== null) return; // Já respondeu
    userSelectedOption = selectedIdx;

    const qData = currentQuestionsList[currentQuestionIndex];
    const isCorrect = (selectedIdx === qData.answer);
    const meta = LEVEL_NAMES[currentLevel];

    answeredQuestions++;
    if (isCorrect) {
      correctAnswers++;
      currentScore += meta.points;
    }

    // Estilização visual imediata das opções
    qData.options.forEach((_, idx) => {
      const btn = document.getElementById(`qOpt_${idx}`);
      if (!btn) return;
      btn.disabled = true;
      if (idx === qData.answer) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    // Feedback explicativo
    const feedbackBox = document.getElementById('quizFeedbackBox');
    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = `quiz-feedback-box ${isCorrect ? 'fb-correct' : 'fb-wrong'}`;
      feedbackBox.innerHTML = `
        <div class="fb-header">
          <span>${isCorrect ? '✅ Resposta Correta! (+ ' + meta.points + ' pts)' : '❌ Resposta Incorreta'}</span>
        </div>
        <div class="fb-body">${qData.explanation}</div>
      `;
    }

    const nextBtn = document.getElementById('btnNextQuestion');
    if (nextBtn) {
      nextBtn.style.display = 'inline-block';
      nextBtn.textContent = (currentQuestionIndex < 4) ? 'Próxima Questão ➔' : 'Ver Resultado do Nível ➔';
    }
  };

  window.handleNextQuestion = function() {
    currentQuestionIndex++;
    userSelectedOption = null;
    if (currentQuestionIndex < 5) {
      renderCurrentQuestion();
    } else {
      renderLevelCompleted();
    }
  };

  function renderLevelCompleted() {
    const containerEl = document.getElementById('console-plot-area');
    if (!containerEl) return;
    const meta = LEVEL_NAMES[currentLevel];

    containerEl.innerHTML = `
      <div class="quiz-overlay-game">
        <div class="quiz-header">
          <div class="quiz-title">
            <span class="quiz-icon">🎉</span>
            <div>
              <strong>NÍVEL ${currentLevel} CONCLUÍDO!</strong>
              <small>${meta.title} (${meta.tag})</small>
            </div>
          </div>
          <button class="chess-btn-icon" onclick="window.closeQuizGame()" title="Fechar">✕</button>
        </div>

        <div class="quiz-summary-card">
          <h3>Seu Desempenho na Partida:</h3>
          <div class="quiz-big-score tabular-num">${currentScore} <small>pontos</small></div>
          <p>Você acertou <strong>${correctAnswers}</strong> de <strong>${answeredQuestions}</strong> questões respondidas nesta rodada!</p>
        </div>

        <div class="quiz-save-score-form">
          <label for="quizPlayerName">Registre sua pontuação na Leaderboard do EconData:</label>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <input type="text" id="quizPlayerName" placeholder="Seu nome ou @handle" maxlength="16" class="console-prompt-input" style="flex: 1;" />
            <button class="console-btn-action" onclick="window.submitQuizScore()">Salvar Pontuação</button>
          </div>
        </div>

        <div class="quiz-actions" style="margin-top: 1.5rem;">
          ${currentLevel < 5 ? `
            <button class="console-btn-action" onclick="window.startQuizAtLevel(${currentLevel + 1})">Avançar para o Nível ${currentLevel + 1} ➔</button>
          ` : ''}
          <button class="console-btn-action" onclick="window.startQuizAtLevel(${currentLevel})">Jogar Novamente Este Nível (Novas Questões) 🔄</button>
          <button class="console-btn-action" onclick="window.launchLeaderboard(document.getElementById('console-plot-area'))">🏆 Ver Leaderboard</button>
        </div>
      </div>
    `;
  }

  window.submitQuizScore = function() {
    const input = document.getElementById('quizPlayerName');
    const name = input ? input.value.trim() : '';
    saveScore(name || 'Dev_EconData', currentScore, currentLevel);
    window.launchLeaderboard(document.getElementById('console-plot-area'));
  };

  window.closeQuizGame = function() {
    const plotArea = document.getElementById('console-plot-area');
    if (plotArea) {
      plotArea.innerHTML = '<div class="plot-placeholder" id="plot-placeholder">Nenhum gráfico gerado ainda.<br>Gere um gráfico com <code>plot()</code> ou <code>ggplot()</code>.</div>';
    }
    const terminal = document.getElementById('r-terminal-output');
    if (terminal) {
      terminal.textContent += '\n[Easter Egg]: Quiz de Programação finalizado. Console R pronto.';
    }
  };
})();
