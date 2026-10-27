export interface Producer {
  producerId: number;
  producerName: string;
  slug: string;
}

export interface FilmProducer {
  producer: Producer;
}
