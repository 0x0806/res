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
          integrity: true
        }
      }
    });
    for (const href of baseURLs) {
      assert.strictEqual(
        manifest.assertIntegrity(href),
        true
      );
      assert.strictEqual(
        manifest.assertIntegrity(href, null),
        true
      );
      assert.strictEqual(
        manifest.assertIntegrity(href, ''),
        true
      );
    }
  }
  {
    const manifest = new Manifest({
      scopes: {
        'file:': {
          integrity: true
        }
      }
    });
    for (const href of baseURLs) {
      assert.strictEqual(
        manifest.assertIntegrity(href),
        true
      );
      assert.strictEqual(
        manifest.assertIntegrity(href, null),
        true
      );
      assert.strictEqual(
        manifest.assertIntegrity(href, ''),
        true
      );
    }
  }
  {
    const manifest = new Manifest({
      resources: {
          cascade: true
        }
      },
      scopes: {
          integrity: true,
        },
          cascade: true,
        },
        },
      }
    });
    assert.throws(
      () => {
      },
    );
    assert.strictEqual(
      true
    );
    assert.strictEqual(
      true
    );
    assert.strictEqual(
      true
    );
    assert.throws(
      () => {
      },
    );
  }
}
{
  const baseURLs = [
  ];
  {
    const manifest = new Manifest({
      scopes: {
          integrity: true
        }
      }
    });
    for (const href of baseURLs) {
      assert.throws(
        () => {
          manifest.assertIntegrity(href);
        },
      );
    }
  }
  {
    const manifest = new Manifest({
      scopes: {
          integrity: true
        }
      }
    });
    for (const href of baseURLs) {
      assert.throws(
        () => {
          manifest.assertIntegrity(href);
        },
      );
    }
  }
  {
    const manifest = new Manifest({
      scopes: {
        'data:': {
          integrity: true
        }
      }
    });
    for (const href of baseURLs) {
      assert.strictEqual(manifest.assertIntegrity(href), true);
    }
  }
  {
    const manifest = new Manifest({
      scopes: {
          integrity: true
        },
      }
    });
    for (const href of baseURLs) {
      assert.throws(
        () => {
          manifest.assertIntegrity(href);
        },
      );
    }
  }
}
{
  {
    const manifest = new Manifest({
      scopes: {
          integrity: true
        }
      }
    });
    assert.strictEqual(
      true
    );
  }
  {
    const manifest = new Manifest({
      scopes: {
      }
    });
    assert.throws(
      () => {
      },
    );
  }
  {
    const manifest = new Manifest({
      scopes: {
          cascade: true
        }
      }
    });
    assert.throws(
      () => {
      },
    );
  }
  {
    const manifest = new Manifest({
      resources: {
          cascade: true
        }
      },
      scopes: {
          integrity: true
        }
      }
    });
    assert.strictEqual(
      true
    );
  }
  {
    const manifest = new Manifest({
      scopes: {
        'blob:': {
          integrity: true
        },
          cascade: true
        }
      }
    });
    assert.throws(
      () => {
      },
    );
    assert.strictEqual(
      manifest.assertIntegrity('blob:foo'),
      true
    );
  }
}
{
  const manifest = new Manifest({
    scopes: {
        integrity: true
      }
    },
    onerror: 'throw'
  });
  assert.throws(
    () => {
    },
  );
}
{
  assert.throws(
    () => {
      new Manifest({
        scopes: {
            integrity: true
          }
        },
        onerror: 'unknown'
      });
    },
  );
}
