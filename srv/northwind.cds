using {northwind as external} from './external/northwind';

service NorthwindService {
    @readonly
    entity Products as projection on external.Products;
}