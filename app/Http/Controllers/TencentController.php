<?php

namespace App\Http\Controllers;

use App\Enums\Tencent;
use App\Services\TencentService;
use DivineOmega\SSHConnection\SSHConnection;
use Illuminate\Http\Request;
use TencentCloud\Common\CommonClient;
use TencentCloud\Common\Credential;
use TencentCloud\Common\Exception\TencentCloudSDKException;
use TencentCloud\Common\Profile\ClientProfile;
use TencentCloud\Common\Profile\HttpProfile;

class TencentController extends Controller
{
    public function index(TencentService $service)
    {
            return $service->runInstances(Tencent::TEMPLATE_ID->value, 1);
//        try {
//            $connection = (new SSHConnection());
//            $connection->to('155.138.235.5')
//                ->onPort(22)
//                ->as('root')
//                ->withPassword('4,GhfT)EvQNNja%.')
//                ->timeout(10);
//            $ssh = $connection->connect();
//            if (!$ssh->isConnected()) {
//                throw new \Exception('SSH connection failed');
//            }
//            return $ssh->run('pwd')->getOutput();
//        } catch (\Exception $e) {
//            return $e->getMessage();
//        }
//        $connection = new TencentService(
//            Tencent::SECRET_ID->value,
//            Tencent::SECRET_KEY->value,
//            Tencent::REGION_ASHBURN->value,
//        );
//        return $connection->terminateInstance('ins-arjypnpv');
        try {

            $cred = new Credential("IKID61jHix1xjLtGWZS9fz84nLiX0IMDrIVh", '5whFaidKn8GAtQmvsfGfrpaAZoqhLo59');

            $httpProfile = new HttpProfile();
            $httpProfile->setEndpoint("cvm.intl.tencentcloudapi.com");
            $clientProfile = new ClientProfile();
            $clientProfile->setHttpProfile($httpProfile);
            $client = new CommonClient("cvm", "2017-03-12", $cred, "ap-hongkong", $clientProfile);

            $params = json_encode([
                'LaunchTemplate' => [
                    'LaunchTemplateId' => Tencent::TEMPLATE_ID->value,
                    'LaunchTemplateVersion' => 1,
                ],
            ]);

            $params = json_encode([
                'InstanceIds' => ['ins-if8cg6ue'],
            ]);


//            return $response = $client->callJson("RunInstances", json_decode($params));

             $response = $client->callJson("DescribeInstances", json_decode($params));

            return $response['InstanceSet'][0]['PublicIpAddresses'];
        } catch (TencentCloudSDKException $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'code' => $e
            ], 500);
        }

    }
}
