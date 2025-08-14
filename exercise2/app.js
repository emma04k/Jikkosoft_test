const nums = [1,3,8,4,20,5,6];
const destiny = 9;

const findIndexes = (numbers,destiny) => {

    const dictionary  = new Map(); // se utiliza un diccionario para guardar el numero y su índice.

    for (let i = 0; i < numbers.length; i++) {

        let result = destiny - numbers[i]; // se realiza una resta, para obtener el valor que deseamos encontrar

        if (dictionary.has(result)) { //si en el diccionario se encuentra el resultado de la resta, hemos encontrado la solución.
            let index = dictionary.get(result);
            return [index, i]; // se retorna la pareja de indices de los números que al sumarlos el resultado es el número destino.
        }
        dictionary.set(numbers[i], i); // Guarda el número actual con su índice para futuras búsquedas
    }
    return  null;
}

const indexes = findIndexes(nums, destiny);
if (indexes !== null){
    console.log(`Los indices de los números que al sumarlos es igual a ${destiny}, son ${indexes[0]} y ${indexes[1]}.`);
}else {
    console.log(`No se encontraron números que su suma sea igual a ${destiny}.`);
}


