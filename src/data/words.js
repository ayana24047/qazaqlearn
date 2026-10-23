
const vocabulary = {
  family: [
    ['ана', 'mother', 'mother'],
    ['әке', 'father', 'father'],
    ['аға', 'older brother', 'brother'],
    ['әпке', 'older sister', 'sister'],
    ['ата', 'grandfather', 'grandfather'],
    ['әже', 'grandmother', 'grandmother'],
  ],

  home: [
    ['үй', 'house', 'house'],
    ['есік', 'door', 'door'],
    ['терезе', 'window', 'window'],
    ['үстел', 'table', 'table'],
    ['орындық', 'chair', 'chair'],
    ['төсек', 'bed', 'bed'],
  ],

  nature: [
    ['тау', 'mountain', 'mountain'],
    ['өзен', 'river', 'river'],
    ['көл', 'lake', 'lake'],
    ['ағаш', 'tree', 'tree'],
    ['гүл', 'flower', 'flower'],
    ['күн', 'sun', 'sun'],
  ],

  food: [
    ['нан', 'bread', 'bread'],
    ['сүт', 'milk', 'milk'],
    ['алма', 'apple', 'apple'],
    ['су', 'water', 'water'],
    ['ет', 'meat', 'meat'],
    ['жұмыртқа', 'egg', 'egg'],
  ],

  animals: [
    ['ит', 'dog', 'dog'],
    ['мысық', 'cat', 'cat'],
    ['жылқы', 'horse', 'horse'],
    ['сиыр', 'cow', 'cow'],
    ['қой', 'sheep', 'sheep'],
    ['құс', 'bird', 'bird'],
  ],

  colors: [
    ['қызыл', 'red', 'red'],
    ['көк', 'blue', 'blue'],
    ['жасыл', 'green', 'green'],
    ['сары', 'yellow', 'yellow'],
    ['ақ', 'white', 'white'],
    ['қара', 'black', 'black'],
  ],

  numbers: [
    ['бір', 'one', 'one'],
    ['екі', 'two', 'two'],
    ['үш', 'three', 'three'],
    ['төрт', 'four', 'four'],
    ['бес', 'five', 'five'],
    ['алты', 'six', 'six'],
  ],

  clothes: [
    ['көйлек', 'dress', 'dress'],
    ['шалбар', 'trousers', 'trousers'],
    ['жейде', 'shirt', 'shirt'],
    ['аяқкиім', 'shoes', 'shoes'],
    ['қалпақ', 'hat', 'hat'],
    ['күрте', 'jacket', 'jacket'],
  ],

  'daily-life': [
    ['оқу', 'to study', 'studying'],
    ['жазу', 'to write', 'writing'],
    ['жүру', 'to walk', 'walking'],
    ['ұйықтау', 'to sleep', 'sleeping'],
    ['ішу', 'to drink', 'drinking'],
    ['жеу', 'to eat', 'eating'],
  ],

  transport: [
    ['көлік', 'vehicle', 'vehicle'],
    ['автобус', 'bus', 'bus'],
    ['пойыз', 'train', 'train'],
    ['ұшақ', 'airplane', 'airplane'],
    ['велосипед', 'bicycle', 'bicycle'],
    ['кеме', 'ship', 'ship'],
  ],
}

export const words = Object.entries(vocabulary).flatMap(
  ([categoryId, entries]) =>
    entries.map(([kazakh, english, filename], index) => ({
      id: `${categoryId}-${index + 1}`,
      categoryId,
      kazakh,
      english,
      image: `/images/words/${filename}.jpg`,
      imageSearch: english,
    }))
)
