import { useEffect, useState } from 'react';
import {
  Banner,
  BlockStack,
  Choice,
  ChoiceList,
  InlineStack,
  useAppMetafields,
  useShippingAddress,
  useApplyShippingAddressChange,
  reactExtension,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.delivery-address.render-after',
  () => <Extension />,
);

function Extension() {

  // Address ID as a state
  const [selectedAddress, setSelectedAddress] = useState('Address 1');
  
  // Effect: update address on selectedAddress change
  useEffect(() => {
    updateAddress();
  }, [selectedAddress]);

  // Get direct shipping addresses from companyLocation metafield
  const shipping = useAppMetafields({
    type: 'companyLocation',
    namespace: 'custom',
    key: 'direct_shipping',
  });

  // Parse the string address into JSON
  const address_str = shipping && shipping.length > 0 ? shipping[0]?.metafield?.value: '{}';
  const address_json = JSON.parse(address_str);
  for (const key in address_json) {
    console.log(key, address_json[key]);
  }
  var i = Object.keys(address_json).length;

  const shippingAddress = useShippingAddress();
  const applyShippingAddressChange = useApplyShippingAddressChange();

  async function updateAddress() {
    const address = address_json[selectedAddress] || shippingAddress;
    const result = await applyShippingAddressChange({
      type: "updateShippingAddress",
      address: address,
    });
    console.log('applyShippingAddressChange: ', address);
  }


  return (
    <InlineStack>
      { i == 3 &&
        <Banner
          status="info"
          title="When [Ship to a different address] is selected, you may select from below direct shipping addresses to pre-fill the shipping address."
        />
      }
      { i == 3 &&
        <ChoiceList
        name="choice"
        value={selectedAddress}
        onChange={(value) => {
          setSelectedAddress(value);
          console.log('value: ', value);
        }}
        >
        <BlockStack>
          <Choice id='Address 1'>{address_json['Address 1'].address1}, {address_json['Address 1'].city}, {address_json['Address 1'].provinceCode}, {address_json['Address 1'].postalCode}</Choice>
          <Choice id='Address 2'>{address_json['Address 2'].address1}, {address_json['Address 2'].city}, {address_json['Address 2'].provinceCode}, {address_json['Address 2'].postalCode}</Choice>
          <Choice id='Address 3'>{address_json['Address 3'].address1}, {address_json['Address 3'].city}, {address_json['Address 3'].provinceCode}, {address_json['Address 3'].postalCode}</Choice>
        </BlockStack>
      </ChoiceList>
    }
    </InlineStack>
  );
}
