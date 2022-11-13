import { Injectable, HttpStatus, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Axios } from 'axios';
import { Cache } from 'cache-manager';

@Injectable()
export class BffService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  public async redirect(req: Request) {
    const productsURL = '/products';
    const productsCacheKey = 'products';
    const recipient = req.url.split('/')[1];
    const recipientUrl = process.env[recipient];

    if (recipientUrl) {
      const axiosConfig = {
        method: req.method,
        url: `${recipientUrl}${req.url}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers['authorization'],
        },
        ...(Object.keys(req.body || {}).length > 0 && {
          data: JSON.stringify(req.body),
        }),
      };

      const axios = new Axios(axiosConfig);

      try {
        if (req.method.toUpperCase() === 'POST' && req.url === productsURL) {
          await this.cachingProducts(req, productsCacheKey);
        }

        const { status, data } = await axios.request(axiosConfig);

        if (
          status === 200 &&
          req.method.toUpperCase() === 'GET' &&
          req.url === productsURL
        ) {
          const productsFromCache = await this.cacheManager.get(
            productsCacheKey,
          );

          if (productsFromCache) {
            return productsFromCache;
          }
        }

        return status >= 200 && status <= 299
          ? JSON.parse(data)
          : {
              status,
              data,
            };
      } catch (error) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: {
            error: error.message,
          },
        };
      }
    } else {
      return {
        statusCode: HttpStatus.BAD_GATEWAY,
        data: {
          error: 'Cannot process request',
        },
      };
    }
  }

  async cachingProducts(req: Request, productsCacheKey: string): Promise<void> {
    const products = 'products';
    const recipientUrl = process.env[products];
    const ttl = 120000; // 120000 ms === 120 s === 2 m

    const axiosConfig = {
      method: 'GET',
      url: `${recipientUrl}/${products}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers['authorization'],
      },
    };

    const axios = new Axios(axiosConfig);

    const { status, data } = await axios.request(axiosConfig);

    if (status === 200) {
      await this.cacheManager.set(productsCacheKey, JSON.parse(data), ttl);
    }
  }
}
