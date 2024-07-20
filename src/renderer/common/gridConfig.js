export const jobListGridConfig = [
  {
    field: 'jobName',
    type: 'text',
    headerName: 'Назва',
    width: 400,
    editable: true,
    required: true,
  },
  {
    field: 'hours',
    type: 'number',
    headerName: 'Норма',
    width: 120,
    editable: true,
    required: true
  },
  {
    field: 'cost',
    type: 'number',
    headerName: 'Вартість',
    width: 130,
    editable: false,
  },
];

export const partsGridConfig = [
  {
    field: 'partName',
    type: 'text',
    headerName: 'Назва',
    width: 220,
    editable: true,
    required: true
  },
  {
    field: 'partNumber',
    type: 'text',
    headerName: 'Парт Номер',
    width: 210,
    editable: true,
    required: false
  },
]

export const carsGridConfig = [
  {
    field: 'brand',
    type: 'text',
    headerName: 'Марка',
    width: 200,
    editable: true,
    required: true
  },
  {
    field: 'model',
    type: 'text',
    headerName: 'Модель',
    width: 320,
    editable: true,
    required: true
  },
  {
    field: 'year',
    type: 'string',
    headerName: 'Рік',
    width: 110,
    editable: true,
    required: true
  },
  {
    field: 'vin',
    type: 'text',
    headerName: 'Vin',
    width: 250,
    editable: true,
    required: true
  },
];

export const serviceHistoryGridConfig = [
  {
    field: 'date',
    type: 'date',
    headerName: 'Дата',
    width: 130,
    editable: true,
    cellClassName: 'padding-10',
  },
  {
    field: 'odometer',
    type: 'number',
    headerName: 'Пробіг(км)',
    width: 150,
    editable: true,
    required: true
  },
  {
    field: 'owner',
    type: 'text',
    headerName: 'Власник',
    width: 220,
    editable: true,
    required: true
  },
  {
    field: 'phone',
    type: 'text',
    headerName: 'Телефон',
    width: 160,
    editable: true,
    required: true
  },
  {
    field: 'overview',
    type: 'text',
    headerName: 'Опис',
    width: 400,
    editable: true,
  },
];

export const serviceVisitJobsGridConfig = [
  {
    field: 'quantity',
    type: 'number',
    headerName: 'Кількість',
    width: 100,
    editable: true,
    required: true
  },
  {
    field: 'price',
    type: 'number',
    headerName: 'Ціна',
    width: 130,
    editable: false,
  },
];

export const serviceVisitPartsGridConfig = [
  {
    field: 'quantity',
    type: 'number',
    headerName: 'Кількість',
    width: 100,
    editable: true,
    required: true
  },
  {
    field: 'price',
    type: 'number',
    headerName: 'Ціна',
    width: 130,
    editable: true,
    required: true
  },
];