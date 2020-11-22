package net.stevencai.ecommerce.config;

import net.stevencai.ecommerce.entity.Product;
import net.stevencai.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public DataRestConfig(EntityManager entityManager){
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedMethods = {HttpMethod.PUT,HttpMethod.DELETE,HttpMethod.POST};

        //disable HTTP methods for Product: put, delete ,post
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedMethods))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedMethods));

        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedMethods))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedMethods));

        //call an internal helper method to expose id.
        exposeId(config);
    }

    private void exposeId(RepositoryRestConfiguration config) {
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        //method 1
//        Class<?>[] entityClasses = (Class<?>[])entities.stream().map( (entity)->{
//            return entity.getJavaType();
//        }).toArray(Class[]::new);

        //method 2
        Class<?>[] entityClasses = entities
                .stream()
                .map(EntityType::getJavaType)
                .toArray(Class<?>[]::new);

        config.exposeIdsFor(entityClasses);

        //method 3
//        config.exposeIdsFor(Product.class,ProductCategory.class);
    }


}
