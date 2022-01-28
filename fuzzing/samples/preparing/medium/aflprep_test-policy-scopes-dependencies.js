'use strict';
if (!common.hasCrypto) common.skip('missing crypto');
common.requireNoPackageJSONAbove();
const assert = require('assert');
{
  const baseURLs = [
  ];
  {
    const manifest = new Manifest({
      scopes: {
          dependencies: true
        }
      }
    });
    for (const href of baseURLs) {
      assert.strictEqual(
        manifest.getDependencyMapper(href).resolve('fs'),
        true
      );
    }
  }
  {
    const manifest = new Manifest({
      scopes: {
        '': {
          dependencies: true
        }
      }
    });
    for (const href of baseURLs) {
      assert.strictEqual(
        manifest.getDependencyMapper(href).resolve('fs'),
        true
      );
    }
  }
  {
    const manifest = new Manifest({
      scopes: {
        '': {
          dependencies: true
        },
        'file:': {
          cascade: true
        }
      }
    });
    for (const href of baseURLs) {
      assert.strictEqual(
        manifest.getDependencyMapper(href).resolve('fs'),
        true
      );
    }
  }
  {
    const manifest = new Manifest({
      scopes: {
        'file:': {
          dependencies: true
        }
      }
    });
    for (const href of baseURLs) {
      assert.strictEqual(
        manifest
          .getDependencyMapper(href)
          .resolve('fs'),
        true);
    }
    assert.strictEqual(
      manifest
        .resolve('fs'),
      true);
  }
  {
    const manifest = new Manifest({
      resources: {
          dependencies: {
            fs: 'test:fs1'
          }
        },
          cascade: true
        }
      },
      scopes: {
          dependencies: {
            fs: 'test:fs2'
          }
        },
        },
      }
    });
    for (const href of baseURLs) {
      const redirector = manifest.getDependencyMapper(href);
        assert.strictEqual(
          redirector.resolve('fs').href,
          'test:fs2'
        );
        assert.strictEqual(
          redirector.resolve('fs').href,
          'test:fs1'
        );
      } else {
        assert.strictEqual(redirector.resolve('fs'), null);
      }
    }
    assert.strictEqual(
      manifest
        .resolve('fs'),
      null
    );
    assert.strictEqual(
      manifest
        .resolve('fs').href,
      'test:fs2'
    );
    assert.strictEqual(
      manifest
        .resolve('fs'),
      null
    );
  }
}
{
  const baseURLs = [
  ];
  {
    const manifest = new Manifest({
      scopes: {
          dependencies: {
            fs: true
          }
        }
      }
    });
    for (const href of baseURLs) {
      assert.strictEqual(
        manifest.getDependencyMapper(href).resolve('fs'),
        null);
    }
  }
  {
    const manifest = new Manifest({
      scopes: {
          dependencies: {
            fs: true
          }
        }
      }
    });
    for (const href of baseURLs) {
      assert.strictEqual(
        manifest.getDependencyMapper(href).resolve('fs'),
        null);
    }
  }
  {
    const manifest = new Manifest({
      scopes: {
        'data:': {
          dependencies: true
        }
      }
    });
    for (const href of baseURLs) {
      assert.strictEqual(
        manifest.getDependencyMapper(href).resolve('fs'),
        true
      );
    }
  }
  {
    const manifest = new Manifest({
      scopes: {
          dependencies: {
            fs: 'test:fs1'
          }
        },
      }
    });
    for (const href of baseURLs) {
      assert.strictEqual(
        manifest.getDependencyMapper(href).resolve('fs'),
        null);
    }
  }
}
{
  {
    const manifest = new Manifest({
      scopes: {
          dependencies: true
        }
      }
    });
    assert.strictEqual(
      manifest
          .resolve('fs'),
      true
    );
  }
  {
    const manifest = new Manifest({
      scopes: {
          dependencies: true
        }
      }
    });
    assert.strictEqual(
      manifest
          .resolve('fs'),
      true
    );
  }
  {
    const manifest = new Manifest({
      scopes: {
      }
    });
    assert.strictEqual(
      manifest
        .resolve('fs'),
      null);
  }
  {
    const manifest = new Manifest({
      scopes: {
          cascade: true
        }
      }
    });
    assert.strictEqual(
      manifest
        .resolve('fs'),
      null);
  }
  {
    const manifest = new Manifest({
      scopes: {
          dependencies: true
        },
          cascade: true
        }
      }
    });
    assert.strictEqual(
      manifest
        .resolve('fs'),
      true
    );
  }
  {
    const manifest = new Manifest({
      scopes: {
        'blob:': {
          dependencies: true
        },
          cascade: true
        }
      }
    });
    assert.strictEqual(
      manifest
        .resolve('fs'),
      null);
    assert.strictEqual(
      manifest
        .getDependencyMapper('blob:foo').resolve('fs'),
      true
    );
  }
}
