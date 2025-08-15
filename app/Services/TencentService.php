<?php

namespace App\Services;

use App\Enums\Tencent;
use TencentCloud\Common\CommonClient;
use TencentCloud\Common\Credential;
use TencentCloud\Common\Exception\TencentCloudSDKException;
use TencentCloud\Common\Profile\ClientProfile;
use TencentCloud\Common\Profile\HttpProfile;

class TencentService
{
    protected CommonClient $client;

    public function __construct(
        protected string $secretId = Tencent::SECRET_ID->value,
        protected string $secretKey = Tencent::SECRET_KEY->value,
        protected string $region = Tencent::REGION_ASHBURN->value,
        protected string $service = Tencent::SERVICE->value,
        protected string $version = Tencent::API_VERSION->value,
        protected string $endpoint = Tencent::API_BASE_URL->value
    )
    {
        $cred = new Credential($this->secretId, $this->secretKey);

        $httpProfile = new HttpProfile();
        $httpProfile->setEndpoint($this->endpoint);

        $clientProfile = new ClientProfile();
        $clientProfile->setHttpProfile($httpProfile);

        $this->client = new CommonClient(
            $this->service,
            $this->version,
            $cred,
            $this->region,
            $clientProfile
        );
    }

    /**
     * Example to run instances with launch template.
     *
     * @param string $launchTemplateId
     * @param int $version
     * @return mixed
     * @throws TencentCloudSDKException
     */
    public function runInstances(string $launchTemplateId, int $version = 1)
    {
        $params = json_encode([
            'LaunchTemplate' => [
                'LaunchTemplateId' => $launchTemplateId,
                'LaunchTemplateVersion' => $version,
            ],
        ]);

        $response = $this->client->callJson('RunInstances', json_decode($params, true));

        if (isset($response['InstanceIdSet']) && is_array($response['InstanceIdSet'])) {
            $instanceId = $response['InstanceIdSet'][0] ?? null;
        }
        return $instanceId;
    }

    /**
     * Describe Instances and get Public IPs of the first instance.
     *
     * @param array $instanceIds
     * @return array|string[]|null  Array of public IP addresses or null if not found
     * @throws TencentCloudSDKException
     */
    public function getPublicIpAddress(string $instanceIds): string | array | null
    {
        $params = json_encode([
            'InstanceIds' => [$instanceIds],
        ]);

        $response = $this->client->callJson('DescribeInstances', json_decode($params, true));

        if (isset($response['InstanceSet'][0]['PublicIpAddresses'])) {
           $ipAddress = $response['InstanceSet'][0]['PublicIpAddresses'][0] ?? null;
        }

        return $ipAddress;
    }

    /**
     * Example to start instances.
     *
     * @param array $instanceIds
     * @return mixed
     * @throws TencentCloudSDKException
     */
    public function startInstance(string $instanceIds)
    {
        $params = json_encode([
            'InstanceIds' => [$instanceIds],
        ]);

        return $this->client->callJson('StartInstances', json_decode($params, true));
    }

    /**
     * Example to stop instances.
     *
     * @param array $instanceIds
     * @return mixed
     * @throws TencentCloudSDKException
     */
    public function stopInstance(string $instanceIds)
    {
        $params = json_encode([
            'InstanceIds' => [$instanceIds],
        ]);

        return $this->client->callJson('StopInstances', json_decode($params, true));
    }

    /**
     * Example to reboot instances.
     *
     * @param array $instanceIds
     * @return mixed
     * @throws TencentCloudSDKException
     */
    public function rebootInstance(string $instanceIds)
    {
        $params = json_encode([
            'InstanceIds' => [$instanceIds],
        ]);

        return $this->client->callJson('RebootInstances', json_decode($params, true));
    }

    /**
     * Example to terminate instances.
     *
     * @param array $instanceIds
     * @return mixed
     * @throws TencentCloudSDKException
     */
    public function terminateInstance(string $instanceIds)
    {
        $params = json_encode([
            'InstanceIds' => [$instanceIds],
        ]);

        return $this->client->callJson('TerminateInstances', json_decode($params, true));
    }


}
